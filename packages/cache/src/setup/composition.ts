import type { ModuleMeta } from "@comity/composition/setup";
import type { CacheModuleContext, CacheModuleOptions } from "./types.js";

import { CompositionError } from "@comity/composition/errors";
import { failure, success } from "@comity/primitives/result";
import { DefaultCache } from "../facade.js";
import { CACHE_TOKEN } from "./constants.js";

export default {
  name: "@comity/cache",
  version: "0.9.0",

  dependsOn: {},
  incompatibleWith: [],

  /** @inheritdoc */
  setup: async (ctx, options) => {
    const initial: CacheModuleOptions = {
      ...options,
    };

    let facade: DefaultCache | undefined;

    ctx.services.define(CACHE_TOKEN, () => facade!);

    return success(async () => {
      const cfg = (await ctx.hooks.execute("@comity/cache:configuring", initial)) ?? initial;

      if (!cfg.store) {
        return failure(
          new CompositionError("initialization_failed", {
            details: {
              module: "@comity/cache",
              violation: "missing_store",
            },
          })
        );
      }

      facade = new DefaultCache(cfg.store!);

      await ctx.hooks.execute("@comity/cache:initialized", undefined);

      return success(undefined);
    });
  },
} satisfies ModuleMeta<CacheModuleOptions, CacheModuleContext>;
