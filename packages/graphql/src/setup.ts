import type {
  ApplicationModuleMeta,
  ApplicationModuleHooks,
  ApplicationContext,
} from "@comity/application";
import type { LoggerModuleContext } from "@comity/logger";
import type { GraphQLModuleHooks, GraphQLModuleOptions } from "./types.js";
import { Hono } from "hono";
import {
  execute,
  GraphQLError,
  parse,
  specifiedRules,
  subscribe,
  validate,
} from "graphql";
import { useEngine, useSchema } from "@envelop/core";
import { GraphQLContainer } from "./container.js";
import { createGraphQLMiddleware } from "./middleware-factory.js";
import { normalizeToGraphQLError } from "./utils/normalize-to-graphql-error.js";

export const setup: ApplicationModuleMeta<
  GraphQLModuleOptions<any>,
  ApplicationContext & LoggerModuleContext
> = {
  name: "@comity/graphql",
  version: "1.0.0",
  setup: async ({ enableInternalTracing, path, plugins, ...options } = {}) => {
    const container = new GraphQLContainer();
    const gql = new Hono(options);

    return async (ctx) => {
      await ctx.trigger<GraphQLModuleHooks["@comity/graphql:initialized"]>(
        "@comity/graphql:initialized",
        {
          get: gql.get.bind(gql),
          post: gql.post.bind(gql),
          put: gql.put.bind(gql),
          delete: gql.delete.bind(gql),
          options: gql.options.bind(gql),
          patch: gql.patch.bind(gql),
          use: gql.use.bind(gql),
          on: gql.on.bind(gql),
          all: gql.all.bind(gql),
          route: gql.route.bind(gql),
          mount: gql.mount.bind(gql),
          fetch: gql.fetch.bind(gql),
          request: gql.request.bind(gql),
          notFound: gql.notFound.bind(gql),
          onError: gql.onError.bind(gql),
          register: container.register.bind(container),
        }
      );

      const schema = container.buildSchema();

      gql.use(
        createGraphQLMiddleware(
          {
            plugins: [
              useEngine({
                parse,
                validate,
                specifiedRules,
                execute,
                subscribe,
              }),
              useSchema(schema),
              ...(plugins || []),
            ],
            enableInternalTracing,
          },
          ctx
        )
      );

      // Handle errors thrown in the GraphQL middleware
      gql.onError((e, c) => {
        const error: GraphQLError = normalizeToGraphQLError(
          e,
          "INTERNAL_SERVER_ERROR",
          {
            status: 500,
          }
        );

        // Format the error for GraphQL response
        const response = {
          message: error.message,
          locations: error.locations,
          path: error.path,
          extensions: error.extensions,
        };

        // Determine the HTTP status code based on the error extensions
        const status = error.extensions?.status || 500;

        return c.json({ errors: [response] }, status);
      });

      // Mount the GraphQL endpoint onto the main application
      ctx.onHook<ApplicationModuleHooks["@comity/application:initialized"]>(
        "@comity/application:initialized",
        async (app) => {
          if (path === "/") {
            throw new Error(
              "GraphQL module cannot be mounted at root path ('/'). Please specify a different path."
            );
          }

          if (typeof app.route === "function") {
            app.route(path || "/graphql", gql);
          }
        }
      );
    };
  },
  dependsOn: ["@comity/application", "@comity/logger"],
  incompatibleWith: [],
};

export default setup;
