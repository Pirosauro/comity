import type { ErrorMeta } from "@comity/core/errors";
import type { KernelState } from "../types.js";

/**
 * Kernel invalid state error metadata
 */
export interface KernelInvalidStateErrorMeta extends ErrorMeta {
  /** Current state */
  state: KernelState;

  /** Action causing the invalid state */
  action: string;
}

/**
 * Module resolution error reason types
 */
export type ModuleResolutionErrorReason =
  | "cycle_detected"
  | "missing_dependency"
  | "incompatible_modules";

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
 * Module load error reasons
 */
export type ModuleLoadErrorReason =
  | "resolution_failed"
  | "setup_failed"
  | "apply_failed";

/**
 * Module load error metadata
 */
export interface ModuleLoadErrorMeta extends ErrorMeta {
  /**
   *
   */
  reason: ModuleLoadErrorReason;

  /**
   *
   */
  module?: string;
}
