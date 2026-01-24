import type { ErrorMeta } from "@comity/primitives/errors";
import type { HttpLifecycleState } from "../lifecycle/state.js";

import { BaseError } from "@comity/primitives/errors";

/**
 * HTTP invalid state error metadata
 */
export interface InvalidLifecycleStateErrorMeta extends ErrorMeta {
  /** Current state */
  state: HttpLifecycleState;

  /** Action causing the invalid state */
  action: string;
}

/**
 * Invalid HTTP state error
 */
export class InvalidLifecycleStateError extends BaseError {
  /** Error code */
  readonly code = "http:invalid-lifecycle-state";

  /**
   * @param meta Error metadata
   */
  constructor(meta: InvalidLifecycleStateErrorMeta) {
    super("Invalid HTTP lifecycle state", {
      httpStatus: 409, // Conflict
      ...meta,
    });
  }
}
