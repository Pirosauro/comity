import type { ModuleMeta } from "@comity/core";

/**
 * Core module metadata for @comity/application.
 *
 * @remarks
 * This module provides the foundational services and utilities for Comity applications.
 * It serves as a self-contained module that can be included in Comity applications
 * to access application-level features like HTTP routing, middleware, and lifecycle management.
 *
 * The application module depends on @comity/core and provides no services itself - it exists
 * primarily for consistency and future extensibility. Applications typically import
 * individual classes and functions directly rather than using this module.
 *
 * @example
 * ```typescript
 * import applicationModule from "@comity/application/setup";
 * import { createApplication } from "@comity/application";
 *
 * // Include in module array for consistency
 * const ctx = await createContext([applicationModule, otherModules...]);
 * ```
 */
const module: ModuleMeta = {
  name: "@comity/application",
  version: "1.0.0",
  setup: async (options) => async () => {},
  dependsOn: ["@comity/core"],
  optionalDependsOn: [],
  incompatibleWith: [],
};

export default module;
