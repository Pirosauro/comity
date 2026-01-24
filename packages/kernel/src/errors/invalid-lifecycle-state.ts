import type { ErrorMeta } from "@comity/primitives/errors";
import type { KernelLifecycleState } from "../lifecycle/state.js";

import { BaseError } from "@comity/primitives/errors";

/**
 * Kernel invalid state error metadata
 */
export interface InvalidLifecycleStateErrorMeta extends ErrorMeta {
  /** Current state */
  state: KernelLifecycleState;

  /** Action causing the invalid state */
  action: string;
}

/**
 * Invalid kernel state error
 */
export class InvalidLifecycleStateError extends BaseError {
  /** Error code */
  readonly code = "kernel:invalid-lifecycle-state";

  /**
   * @param meta Error metadata
   */
  constructor(meta: InvalidLifecycleStateErrorMeta) {
    super("Invalid kernel lifecycle state", {
      httpStatus: 409, // Conflict
      ...meta,
    });
  }
}
