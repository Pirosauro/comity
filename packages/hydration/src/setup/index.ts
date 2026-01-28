import type { ModuleMeta } from "@comity/kernel/modules";

import { success } from "@comity/primitives/result";

/**
 * @see ModuleMeta
 */
export const module: ModuleMeta = {
  name: "@comity/hydration",
  version: "1.0.0",

  dependsOn: [],
  incompatibleWith: [],

  /** @inheritdoc */
  setup: async (options) => {
    return success(async (ctx) => {
      // This module does not perform any setup by itself
      return success(undefined);
    });
  },
};

export default module;
