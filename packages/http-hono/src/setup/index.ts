import type { ModuleMeta } from "@comity/kernel/modules";
import type { HttpHonoModuleOptions } from "./types.js";

import { success } from "@comity/primitives/result";

/**
 * Hono HTTP adapter kernel module.
 *
 * @remarks
 * This module does not perform any setup by itself. It is provided for
 * consistency with other Comity modules and to allow future integration
 * with kernel services.
 *
 * The adapter works independently of the kernel and can be used directly
 * via `createHonoHandler`.
 */
export const module: ModuleMeta<HttpHonoModuleOptions> = {
  name: "@comity/http-hono",
  version: "1.0.0",

  dependsOn: ["@comity/primitives", "@comity/kernel", "@comity/http"],
  incompatibleWith: [],

  /**
   * Setup factory.
   *
   * @param options Module options
   * @returns Setup function
   */
  setup: async (options) => {
    return success(async (ctx) => {
      // No services to register by default
      // Future: could register facade in services if provided in options

      return success(undefined);
    });
  },
};

export default module;
