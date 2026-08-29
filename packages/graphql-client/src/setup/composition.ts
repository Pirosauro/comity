import type { ModuleMeta } from "@comity/composition/setup";
import type { GraphqlClientModuleContext, GraphqlClientModuleOptions } from "./types.js";

import { CompositionError } from "@comity/composition/errors";
import { failure, success } from "@comity/primitives/result";
import { DefaultGraphqlRegistry } from "../registry.js";
import { GRAPHQL_CLIENT_TOKEN } from "./constants.js";

const composition: ModuleMeta<GraphqlClientModuleOptions, GraphqlClientModuleContext> = {
  name: "@comity/graphql-client",
  version: "0.9.0",

  dependsOn: {},
  incompatibleWith: [],

  /** @inheritdoc */
  setup: async (ctx, options) => {
    const initial: GraphqlClientModuleOptions = {
      ...options,
    };

    let registry: DefaultGraphqlRegistry | undefined;

    ctx.services.define(GRAPHQL_CLIENT_TOKEN, () => registry!);

    return success(async () => {
      const cfg = (await ctx.hooks.execute("@comity/graphql-client:configuring", initial)) ?? initial;

      if (typeof cfg !== "object" || Object.keys(cfg).length === 0) {
        return failure(
          new CompositionError("initialization_failed", {
            details: {
              module: "@comity/graphql-client",
              violation: "missing_transport",
            },
          })
        );
      }

      registry = new DefaultGraphqlRegistry(cfg as GraphqlClientModuleOptions);

      await ctx.hooks.execute("@comity/graphql-client:initialized", undefined);

      return success(undefined);
    });
  },
};

export default composition;