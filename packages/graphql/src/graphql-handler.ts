import type { DocumentNode, FormattedExecutionResult } from "graphql";
import type { Context, Env, Input, MiddlewareHandler } from "hono";
import type { Options } from "../types";
import {
  execute,
  parse,
  subscribe,
  validate,
  validateSchema,
  specifiedRules,
  getOperationAST,
  Source,
  GraphQLError,
} from "graphql";
import { envelop, useEngine, useSchema } from "@envelop/core";
import { ServiceError } from "./service-error.js";
import { getGraphQLParams } from "./get-graphql-params.js";

export const graphqlHandler = <
  E extends Env = any,
  P extends string = any,
  I extends Input = {}
>(
  options: Options<E, P, I>
): MiddlewareHandler => {
  const schema = options.schema;
  const pretty = options.pretty ?? false;
  const validationRules = options.validationRules ?? [];
  const plugins = options.plugins ?? [];

  // @ts-ignore
  const getEnveloped = envelop({
    plugins: [
      ...plugins,
      useEngine({ parse, validate, specifiedRules, execute, subscribe }),
      useSchema(schema),
    ],
  });

  return async (c: Context<E, P, I>) => {
    // GraphQL HTTP only supports GET and POST methods.
    if (c.req.method !== "GET" && c.req.method !== "POST") {
      return c.json(
        new ServiceError("GraphQL only supports GET and POST requests."),
        405,
        {
          Allow: "GET, POST",
        }
      );
    }

    const { parse, validate, contextFactory, execute, schema } = getEnveloped({
      req: c.req,
    });

    let params: GraphQLParams;

    try {
      params = await getGraphQLParams(c.req.raw);
    } catch (e) {
      if (e instanceof Error) {
        console.error(`${e.stack || e.message}`);

        return c.json(new ServiceError(e.message, [e]), 400);
      }

      throw e;
    }

    const { query, variables, operationName } = params;

    if (query == null) {
      return c.json(new ServiceError("Must provide query string."), 400);
    }

    const schemaValidationErrors = validateSchema(schema);

    if (schemaValidationErrors.length > 0) {
      // return 500: Internal Server Error if invalid schema.
      return c.json(
        new ServiceError(
          "GraphQL schema validation error.",
          schemaValidationErrors
        ),
        500
      );
    }

    let documentAST: DocumentNode;

    try {
      documentAST = parse(new Source(query, "GraphQL request"));
    } catch (syntaxError: unknown) {
      // return 400: Bad Request if any syntax errors errors exist.
      if (syntaxError instanceof Error) {
        console.error(`${syntaxError.stack || syntaxError.message}`);

        const e = new GraphQLError(syntaxError.message, {
          originalError: syntaxError,
        });

        return c.json(new ServiceError("GraphQL syntax error.", [e]), 400);
      }

      throw syntaxError;
    }

    // validate AST, reporting any errors.
    const validationErrors = validate(schema, documentAST, [
      ...specifiedRules,
      ...validationRules,
    ]);

    if (validationErrors.length > 0) {
      // return 400: Bad Request if any validation errors exist.
      return c.json(
        new ServiceError("GraphQL validation error.", validationErrors),
        400
      );
    }

    if (c.req.method === "GET") {
      // Determine if this GET request will perform a non-query.
      const operationAST = getOperationAST(documentAST, operationName);

      if (operationAST && operationAST.operation !== "query") {
        // Otherwise, report a 405: Method Not Allowed error.
        return c.json(
          new ServiceError(
            `Can only perform a ${operationAST.operation} operation from a POST request.`
          ),
          405,
          { Allow: "POST" }
        );
      }
    }

    let result: FormattedExecutionResult;
    const { rootResolver } = options;

    try {
      const context = await contextFactory();
      result = await execute({
        schema,
        document: documentAST,
        rootValue: rootResolver ? await rootResolver(context) : null,
        contextValue: context, // c,
        variableValues: variables,
        operationName: operationName,
      });
    } catch (contextError: unknown) {
      if (contextError instanceof Error) {
        console.error(`${contextError.stack || contextError.message}`);

        const e = new GraphQLError(contextError.message, {
          originalError: contextError,
          nodes: documentAST,
        });

        // return 400: Bad Request if any execution context errors exist.
        return c.json(
          new ServiceError("GraphQL execution context error.", [e]),
          400
        );
      }

      throw contextError;
    }

    if (!result.data && result.errors) {
      return c.json(
        new ServiceError(result.errors.toString(), result.errors),
        500
      );
    }

    if (pretty) {
      const payload = JSON.stringify(result, null, pretty ? 2 : 0);

      return c.text(payload, 200, {
        "Content-Type": "application/json",
      });
    } else {
      return c.json(result);
    }
  };
};

export interface GraphQLParams {
  query: string | null;
  variables: { readonly [name: string]: unknown } | null;
  operationName: string | null;
  raw: boolean;
}
