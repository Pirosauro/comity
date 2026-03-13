import type { ModuleMeta } from "@comity/composition";
import type { CacheObserver } from "../hooks/cache.js";
import type { CacheModuleContext, CacheModuleOptions } from "./types.js";

import { success } from "@comity/primitives/result";
import { DefaultCache } from "../facade.js";
import { MemoryCacheStore } from "../stores/memory.js";
import { CACHE_TOKEN } from "./constants.js";

export const module: ModuleMeta<CacheModuleOptions, CacheModuleContext> = {
  name: "@comity/cache",
  version: "1.0.0",

  dependsOn: {},
  incompatibleWith: [],

  /** @inheritdoc */
  setup: async (ctx, options) => {
    const initial: CacheModuleOptions = {
      ...options,
    };
    const cfg = (await ctx.hooks.execute("@comity/cache:configuring", initial)) ?? initial;

    // If no store is provided, use the default in-memory implementation
    if (!cfg.store) {
      cfg.store = new MemoryCacheStore();
    }

    return success(async () => {
      const observer: CacheObserver = {
        /** @inheritdoc */
        onCacheSet: (entry) => ctx.events.emit("@comity/cache:set", entry),

        /** @inheritdoc */
        onCacheDelete: (key) => ctx.events.emit("@comity/cache:delete", key),

        /** @inheritdoc */
        onCacheClear: () => ctx.events.emit("@comity/cache:clear", undefined),

        /** @inheritdoc */
        onCacheHit: (key) => ctx.events.emit("@comity/cache:hit", key),

        /** @inheritdoc */
        onCacheMiss: (key) => ctx.events.emit("@comity/cache:miss", key),
      };

      const facade = new DefaultCache(cfg.store!, observer);

      ctx.services.define(CACHE_TOKEN, () => facade);

      await ctx.hooks.execute("@comity/cache:initialized", undefined);

      return success(undefined);
    });
  },
};
