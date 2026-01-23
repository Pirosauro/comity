import type { KernelInvalidStateErrorMeta } from "./types.js";

import { BaseError } from "@comity/primitives/errors";

/**
 * Invalid kernel state error
 */
export class KernelInvalidStateError extends BaseError {
  /** Error code */
  readonly code = "kernel:invalid-state";

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
