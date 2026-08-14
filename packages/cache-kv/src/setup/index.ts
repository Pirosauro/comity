import type { CacheModuleContext } from "@comity/cache/setup";
import type { ModuleMeta } from "@comity/composition/setup";
import type { KvCacheModuleContext, KvCacheModuleOptions } from "./types.js";

import { success } from "@comity/primitives/result";
import { KvCacheStore } from "../store.js";

export const module: ModuleMeta<KvCacheModuleOptions, KvCacheModuleContext & CacheModuleContext> = {
  name: "@comity/cache-kv",
  version: "0.9.0",

  dependsOn: {},
  incompatibleWith: [],

  /** @inheritdoc */
  setup: async (ctx, options) => {
    if (options?.ns) {
      const store = new KvCacheStore(options.ns);

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

export default module;
