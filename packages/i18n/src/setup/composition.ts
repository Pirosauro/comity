import type { ModuleMeta } from "@comity/composition/setup";
import type { I18nOptions } from "../facade.js";
import type { I18nModuleContext, I18nModuleOptions } from "./types.js";

import { CompositionError } from "@comity/composition/errors";
import { failure, success } from "@comity/primitives/result";
import { DefaultI18n } from "../facade.js";
import { I18N_TOKEN } from "./constants.js";

export default {
  name: "@comity/i18n",
  version: "0.9.0",

  dependsOn: {},
  incompatibleWith: [],

  /** @inheritdoc */
  setup: async (ctx, options) => {
    const initial: I18nModuleOptions = {
      ...options,
    };

    let service: DefaultI18n | undefined;

    ctx.services.define(I18N_TOKEN, () => service!);

    return success(async () => {
      const cfg = (await ctx.hooks.execute("@comity/i18n:configuring", initial)) ?? initial;

      if (!cfg.loader) {
        return failure(
          new CompositionError("initialization_failed", {
            details: {
              module: "@comity/i18n",
              violation: "missing_loader",
            },
          })
        );
      }

      if (!cfg.factory) {
        return failure(
          new CompositionError("initialization_failed", {
            details: {
              module: "@comity/i18n",
              violation: "missing_translator",
            },
          })
        );
      }

      service = new DefaultI18n(cfg as I18nOptions);

      await ctx.hooks.execute("@comity/i18n:initialized", undefined);

      return success(undefined);
    });
  },
} satisfies ModuleMeta<I18nModuleOptions, I18nModuleContext>;
