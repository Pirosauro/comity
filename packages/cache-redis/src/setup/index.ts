import type { CacheModuleContext } from "@comity/cache";
import type { ModuleMeta } from "@comity/composition";
import type { RedisCacheModuleContext, RedisCacheModuleOptions } from "./types.js";

import { success } from "@comity/primitives/result";
import { RedisCacheStore } from "../store.js";

export const module: ModuleMeta<
  RedisCacheModuleOptions,
  RedisCacheModuleContext & CacheModuleContext
> = {
  name: "@comity/cache-redis",
  version: "1.0.0",

  dependsOn: {},
  incompatibleWith: [],

  /** @inheritdoc */
  setup: async (ctx, options) => {
    if (options?.client) {
      const store = new RedisCacheStore(options.client);

      ctx.hooks.define("@comity/cache:configuring", (cfg) => {
        return {
          ...cfg,
          store,
        };
      });
    }

    return success(async () => success(undefined));
  },
};
