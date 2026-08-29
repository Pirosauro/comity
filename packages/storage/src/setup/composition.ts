import type { ModuleMeta } from "@comity/composition/setup";
import type { StorageModuleContext, StorageModuleOptions } from "./types.js";

import { CompositionError } from "@comity/composition/errors";
import { failure, success } from "@comity/primitives/result";
import { DefaultStorage } from "../facade.js";
import { STORAGE_TOKEN } from "./constants.js";

const composition: ModuleMeta<StorageModuleOptions, StorageModuleContext> = {
  name: "@comity/storage",
  version: "0.9.0",

  dependsOn: {},
  incompatibleWith: [],

  /** @inheritdoc */
  setup: async (ctx, options) => {
    const initial: StorageModuleOptions = {
      ...options,
    };

    let facade: DefaultStorage | undefined;

    ctx.services.define(STORAGE_TOKEN, () => facade!);

    return success(async () => {
      const cfg = (await ctx.hooks.execute("@comity/storage:configuring", initial)) ?? initial;

      if (!cfg.store) {
        return failure(
          new CompositionError("initialization_failed", {
            details: {
              module: "@comity/storage",
              violation: "missing_store",
            },
          })
        );
      }

      facade = new DefaultStorage(cfg.store!);

      await ctx.hooks.execute("@comity/storage:initialized", undefined);

      return success(undefined);
    });
  },
};

export default composition;