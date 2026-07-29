import type { ModuleMeta } from "@comity/composition";
import type { I18nModuleContext } from "@comity/i18n";
import type { I18nTypesafeModuleOptions } from "./types.js";

import { CompositionError } from "@comity/composition/errors";
import { failure, success } from "@comity/primitives/result";
import { createTypesafeFactory } from "../factory.js";
import { TypesafeI18nLoader } from "../loader.js";

export const module: ModuleMeta<I18nTypesafeModuleOptions, I18nModuleContext> = {
  name: "@comity/i18n-typesafe",
  version: "0.9.0",

  dependsOn: { "@comity/i18n": {} },
  incompatibleWith: [],

  /** @inheritdoc */
  setup: async (ctx, options) => {
    if (!options?.loadLocaleAsync) {
      return failure(
        new CompositionError("setup_failed", {
          details: {
            module: "@comity/i18n-typesafe",
            violation: "missing_loader",
          },
        })
      );
    }

    if (!options?.createI18n) {
      return failure(
        new CompositionError("setup_failed", {
          details: {
            module: "@comity/i18n-typesafe",
            violation: "missing_translator",
          },
        })
      );
    }

    ctx.hooks.define("@comity/i18n:configuring", (cfg) => {
      return {
        ...cfg,
        loader: new TypesafeI18nLoader(options.loadLocaleAsync),
        factory: createTypesafeFactory(options.createI18n),
      };
    });

    return success(async () => success(undefined));
  },
};
