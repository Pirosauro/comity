import type { ModuleMeta } from "../types.js";

/**
 * Core module metadata for @comity/core.
 *
 * @remarks
 * This module provides the foundational services and utilities for the Comity framework.
 * It serves as a self-contained module that can be included in Comity applications
 * to access core framework features like dependency injection, lifecycle management,
 * and error handling.
 *
 * The core module has no dependencies and provides no services itself - it exists
 * primarily for consistency and future extensibility. Applications typically import
 * individual classes and functions directly rather than using this module.
 *
 * @example
 * ```typescript
 * import coreModule from "@comity/core/setup";
 * import { Container } from "@comity/core";
 *
 * // Include in module array for consistency
 * const ctx = await createContext([coreModule, otherModules...]);
 * ```
 */
const module: ModuleMeta = {
  name: "@comity/core",
  version: "1.0.0",
  setup: async (options) => async () => {},
  dependsOn: [],
  optionalDependsOn: [],
  incompatibleWith: [],
};

export default module;
