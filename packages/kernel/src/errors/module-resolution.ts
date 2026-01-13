import type { ModuleResolutionErrorMeta } from "./types.js";

import { BaseError } from "@comity/core/errors";

/**
 * Module resolution error
 *
 * @remarks
 * This error is thrown when there is a problem resolving modules,
 * such as detecting a cycle, missing dependencies, or incompatible modules.
 *
 * @example
 * ```typescript
 * // Cycle detected
 * throw new ModuleResolutionError({
 *   reason: "cycle_detected",
 *   cycle: ["moduleA", "moduleB", "moduleC"]
 * });
 *
 * // Missing dependency
 * throw new ModuleResolutionError({
 *   reason: "missing_dependency",
 *   module: "moduleA",
 *   dependency: "moduleB"
 * });
 * ```
 */
export class ModuleResolutionError extends BaseError {
  /** Error code  */
  readonly code = "kernel:module_resolution_failed";

  /**
   * @param meta Error metadata
   */
  constructor(meta: ModuleResolutionErrorMeta) {
    super("Module resolution failed", {
      httpStatus: meta.httpStatus ?? 500,
      ...meta,
    });
  }
}
