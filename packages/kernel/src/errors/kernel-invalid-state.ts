import type { KernelInvalidStateErrorMeta } from "./types.js";

import { BaseError } from "@comity/core/errors";

/**
 * Invalid kernel state error
 */
export class KernelInvalidStateError extends BaseError {
  /** Error code */
  readonly code = "kernel:invalid_state";

  /**
   * @param meta Error metadata
   */
  constructor(meta: KernelInvalidStateErrorMeta) {
    super("Invalid kernel state", {
      httpStatus: 409, // Conflict
      ...meta,
    });
  }
}
