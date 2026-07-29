import type { ModuleMeta } from "@comity/composition";
import type { CacheModuleContext, CacheModuleOptions } from "./types.js";

import { CompositionError } from "@comity/composition/errors";
import { failure, success } from "@comity/primitives/result";
import { DefaultCache } from "../facade.js";
import { CACHE_TOKEN } from "./constants.js";

export const module: ModuleMeta<CacheModuleOptions, CacheModuleContext> = {
  name: "@comity/cache",
  version: "0.9.0",

  dependsOn: {},
  incompatibleWith: [],

  /** @inheritdoc */
  setup: async (ctx, options) => {
    const initial: CacheModuleOptions = {
      ...options,
    };
    const cfg = (await ctx.hooks.execute("@comity/cache:configuring", initial)) ?? initial;

    if (!cfg.store) {
      return failure(
        new CompositionError("setup_failed", {
          details: {
            module: "@comity/storage",
            violation: "missing_store",
          },
        })
      );
    }

    return success(async () => {
      const facade = new DefaultCache(cfg.store!);

      ctx.services.define(CACHE_TOKEN, () => facade);

      await ctx.hooks.execute("@comity/cache:initialized", undefined);

      return success(undefined);
    });
  },
};

export default module;
