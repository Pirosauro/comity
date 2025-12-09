import type {
  DocumentNode,
  ExecutionArgs,
  ExecutionResult,
  GraphQLSchema,
  Source,
} from "graphql";
import type { GetEnvelopedFn } from "@envelop/core";
import type {
  ApplicationContext,
  HonoMiddlewareHandler,
} from "@comity/application";
import type { LoggerModuleContext } from "@comity/logger";
import type {
  GraphQLModuleEvents,
  GraphQLModuleHooks,
  GraphQLModuleOptions,
} from "./types.js";
import { envelop } from "@envelop/core";
import { getOperationAST, GraphQLError } from "graphql";
import {
  determineHttpStatus,
  getGraphQLParams,
  getErrorContext,
  normalizeToGraphQLError,
} from "./utils/index.js";

type EnvelopContextFactory = Pick<
  ReturnType<GetEnvelopedFn<any>>,
  "contextFactory"
>["contextFactory"];

type TypedEnveloped = {
  parse: (source: string | Source) => DocumentNode;
  validate: (schema: GraphQLSchema, document: DocumentNode) => GraphQLError[];
  execute: (args: ExecutionArgs) => Promise<ExecutionResult>;
  schema: GraphQLSchema;
  contextFactory: EnvelopContextFactory;
};

export const createGraphQLMiddleware = (
  options: GraphQLModuleOptions,
  ctx: ApplicationContext & LoggerModuleContext
): HonoMiddlewareHandler => {
  const getEnveloped = envelop({
    plugins: options.plugins || [],
    enableInternalTracing: options.enableInternalTracing,
  });
  const logger = ctx.logger.child({
    module: "@comity/graphql",
  });

  return async (c, next) => {
    // GraphQL HTTP only supports GET and POST methods.
    if (c.req.method !== "GET" && c.req.method !== "POST") {
      return next();
    }

    /**
     * Handles errors by logging them, emitting an error event,
     * and normalizing them to GraphQLError format.
     * @param error - The error to handle.
     * @param context - The context in which the error occurred.
     * @param status - The HTTP status code to use.
     */
    const handleError = async (
      error: unknown,
      code: string,
      status: number = 500
    ) => {
      // Ensure the error is an Error object
      if (typeof error === "string") {
        error = new Error(error);
      }

      logger.error({ error }, `GraphQL error: ${code}`);

      // Emit error event for monitoring and logging
      await ctx.emit<GraphQLModuleEvents["@comity/graphql:error"]>(
        "@comity/graphql:error",
        {
          error,
          context: getErrorContext(code),
          ip: c.req.header("x-forwarded-for") || c.req.header("x-real-ip"),
          userAgent: c.req.header("user-agent"),
        }
      );

      return normalizeToGraphQLError(error, code, { status });
    };

    try {
      const { parse, validate, contextFactory, execute, schema } = getEnveloped(
        {
          req: c.req,
        }
      ) as TypedEnveloped;
      const { query, variables, operationName } = await getGraphQLParams(
        c.req.raw
      );

      // Missing query string -> 400 Bad Request
      if (!query) {
        const error = await handleError(
          "Must provide query string.",
          "EMPTY_QUERY",
          400
        );

        return c.json({ errors: [error] }, 400);
      }

      let document: DocumentNode;

      try {
        document = parse(query);
      } catch (e) {
        const error = await handleError(e, "GRAPHQL_SYNTAX_ERROR", 400);

        return c.json({ errors: [error] }, 400);
      }

      if (c.req.method === "GET") {
        // Determine if this GET request will perform a non-query operation
        const ast = getOperationAST(document, operationName);

        if (ast && ast.operation !== "query") {
          const error = await handleError(
            `Can only perform a ${ast.operation} operation from a POST request.`,
            "METHOD_NOT_ALLOWED",
            405
          );

          return c.json({ errors: [error] }, 405);
        }
      }

      // Validate the document against the schema
      const errors = validate(schema, document);

      if (errors.length > 0) {
        // If there are validation errors, return them in the response
        return c.json(
          {
            data: null,
            errors,
          },
          200
        );
      }

      let context: ReturnType<EnvelopContextFactory>;

      try {
        context = await contextFactory();
      } catch (e) {
        const error = await handleError(e, "CONTEXT_ERROR", 500);

        return c.json({ errors: [error] }, 500);
      }

      const result = await execute({
        schema,
        document,
        contextValue: context,
        variableValues: variables,
        operationName,
      });
      const status = determineHttpStatus(result.errors || []);

      return c.json(result, status);
    } catch (e) {
      const error = normalizeToGraphQLError(e, "UNKNOWN_ERROR", {
        status: 500,
      });

      await ctx.emit<GraphQLModuleEvents["@comity/graphql:error"]>(
        "@comity/graphql:error",
        {
          error: e,
          context: getErrorContext(
            (error.extensions?.code as string | undefined) || "UNKNOWN_ERROR"
          ),
          ip: c.req.header("x-forwarded-for") || c.req.header("x-real-ip"),
          userAgent: c.req.header("user-agent"),
        }
      );

      const status = error.extensions?.status || 500;

      return c.json({ errors: [error] }, status);
    }
  };
};
