import type { ModuleMeta } from "@comity/kernel/modules";
import { success } from "@comity/primitives/result";

/**
 * Metadata for the HTTP module.
 *
 * @comity ai-jsdoc-skip
 */
export const module: ModuleMeta = {
  name: "@comity/http",
  version: "1.0.0",

  dependsOn: ["@comity/primitives", "@comity/kernel"],
  incompatibleWith: [],

  /** @inheritdoc */
  setup: async (ctx) => {
    return success(async (ctx) => {
      // NOTE: pipeline wiring happens in higher-level modules
      // or app-level configuration

      return success(undefined);
    });
  },
};

export default module;
