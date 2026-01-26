import type { ModuleMeta } from "@comity/kernel/modules";

import { success } from "@comity/primitives/result";

/**
 * Module metadata
 * 
 * @see ModuleMeta
 * 
 * @remarks This module does not perform any setup by itself. It only provides
 * types and utilities for hydration functionality.
 */
export const module: ModuleMeta = {
  name: "@comity/hydration",
  version: "1.0.0",

  /**
   * Setup factory
   * 
   * @param options Setup options
   * @returns Setup function
   */
  setup: async (options) => {
    return success(async (ctx) => {
      return success(undefined);
    });
  },

  dependsOn: ["@comity/primitives", "@comity/kernel"],
  incompatibleWith: [],
};

export default module;
