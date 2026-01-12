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
