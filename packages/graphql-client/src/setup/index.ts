import type { ModuleMeta } from "@comity/composition";
import type { GraphqlClientOptions } from "../client.js";
import type { GraphqlClientModuleContext, GraphqlClientModuleOptions } from "./types.js";

import { CompositionError } from "@comity/composition/error";
import { failure, success } from "@comity/primitives/result";
import { GraphqlClient } from "../client.js";
import { GRAPHQL_CLIENT_TOKEN } from "./constants.js";

export const module: ModuleMeta<GraphqlClientModuleOptions, GraphqlClientModuleContext> = {
  name: "@comity/graphql-client",
  version: "1.0.0",

  dependsOn: {},
  incompatibleWith: [],

  /** @inheritdoc */
  setup: async (ctx, options) => {
    const initial: GraphqlClientModuleOptions = {
      ...options,
    };
    const cfg = (await ctx.hooks.execute("@comity/graphql-client:configuring", initial)) ?? initial;

    if (!cfg.transport) {
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
      const client = new GraphqlClient(cfg as GraphqlClientOptions);

      ctx.services.define(GRAPHQL_CLIENT_TOKEN, () => client);

      await ctx.hooks.execute("@comity/graphql-client:initialized", undefined);

      return success(undefined);
    });
  },
};

export default module;
