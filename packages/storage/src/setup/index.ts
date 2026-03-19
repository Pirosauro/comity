import type { ModuleMeta } from "@comity/composition";
import type { StorageModuleContext, StorageModuleOptions } from "./types.js";

import { CompositionError } from "@comity/composition/error";
import { failure, success } from "@comity/primitives/result";
import { DefaultStorage } from "../facade.js";
import { STORAGE_TOKEN } from "./constants.js";

export const module: ModuleMeta<StorageModuleOptions, StorageModuleContext> = {
  name: "@comity/storage",
  version: "1.0.0",

  dependsOn: {},
  incompatibleWith: [],

  /** @inheritdoc */
  setup: async (ctx, options) => {
    const initial: StorageModuleOptions = {
      ...options,
    };
    const cfg = (await ctx.hooks.execute("@comity/storage:configuring", initial)) ?? initial;

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
      const facade = new DefaultStorage(cfg.store!);

      ctx.services.define(STORAGE_TOKEN, () => facade);

      await ctx.hooks.execute("@comity/storage:initialized", undefined);

      return success(undefined);
    });
  },
};
