import type { ErrorMeta } from "@comity/primitives/errors";
import type { KernelState } from "../lifecycle/state.js";

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
 * Module load error reasons
 */
export type ModuleLoadErrorReason =
  | "resolution-failed"
  | "setup-failed"
  | "apply-failed";

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
