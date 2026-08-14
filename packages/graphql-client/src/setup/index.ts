import type { ModuleMeta } from "@comity/composition/setup";
import type { GraphqlClientModuleContext, GraphqlClientModuleOptions } from "./types.js";

import { CompositionError } from "@comity/composition/errors";
import { failure, success } from "@comity/primitives/result";
import { DefaultGraphqlRegistry } from "../registry.js";
import { GRAPHQL_CLIENT_TOKEN } from "./constants.js";

export { GRAPHQL_CLIENT_TOKEN } from "./constants.js";
export type {
  GraphqlClientModuleContext,
  GraphqlClientModuleEvents,
  GraphqlClientModuleHooks,
  GraphqlClientModuleOptions,
  GraphqlClientModuleServices,
} from "./types.js";

export const module: ModuleMeta<GraphqlClientModuleOptions, GraphqlClientModuleContext> = {
  name: "@comity/graphql-client",
  version: "0.9.0",

  dependsOn: {},
  incompatibleWith: [],

  /** @inheritdoc */
  setup: async (ctx, options) => {
    const initial: GraphqlClientModuleOptions = {
      ...options,
    };
    const cfg = (await ctx.hooks.execute("@comity/graphql-client:configuring", initial)) ?? initial;

    if (typeof cfg !== "object" || Object.keys(cfg).length === 0) {
      return failure(
        new CompositionError("setup_failed", {
          details: {
            module: "@comity/graphql-client",
            violation: "missing_transport",
          },
        })
      );
    }

    return success(async () => {
      const registry = new DefaultGraphqlRegistry(cfg as GraphqlClientModuleOptions);

      ctx.services.define(GRAPHQL_CLIENT_TOKEN, () => registry);

      await ctx.hooks.execute("@comity/graphql-client:initialized", undefined);

      return success(undefined);
    });
  },
};

export default module;
