import type { CacheModuleContext } from "@comity/cache/setup";
import type { ModuleMeta } from "@comity/composition/setup";
import type { RedisCacheModuleContext, RedisCacheModuleOptions } from "./types.js";

import { success } from "@comity/primitives/result";
import { RedisCacheStore } from "../store.js";

const composition: ModuleMeta<
  RedisCacheModuleOptions,
  RedisCacheModuleContext & CacheModuleContext
> = {
  name: "@comity/cache-redis",
  version: "0.9.0",

  dependsOn: { "@comity/cache": { optional: false } },
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

export default composition;