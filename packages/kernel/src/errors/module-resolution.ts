import type { ErrorMeta } from "@comity/primitives/errors";

import { BaseError } from "@comity/primitives/errors";

/**
 * Module resolution error reason types
 */
export type ModuleResolutionErrorReason =
  | "cycle-detected"
  | "missing-dependency"
  | "incompatible-modules";

/**
 * Module resolution error metadata
 */
export interface ModuleResolutionErrorMeta extends ErrorMeta {
  /**
   * Reason for the module resolution failure
   */
  reason: ModuleResolutionErrorReason;

  /**
   * Module involved in the error
   */
  module?: string;

  /**
   * Dependency involved in the error
   */
  dependency?: string;

  /**
   * Cycle detected (if reason is "cycle_detected")
   */
  cycle?: string[];
}

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
  readonly code = "kernel:module-resolution-failed";

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
