import type { ErrorMeta } from "@comity/primitives/error";
import type { KernelLifecycleState } from "../lifecycle/types.js";

import { BaseError } from "@comity/primitives/error";

/**
 * Reasons for kernel errors.
 */
export type KernelErrorReason = "invalid_lifecycle_state";

/**
 * Kernel error metadata.
 */
export interface KernelErrorMeta extends ErrorMeta {
  /** Lifecycle state */
  readonly state: KernelLifecycleState;

  /** Action attempted */
  readonly action: string;
}

/** Error messages for kernel errors */
const REASON_MESSAGES: Record<KernelErrorReason, string> = {
  invalid_lifecycle_state: "Invalid lifecycle state",
};
/** Error HTTP status codes for kernel errors */
const REASON_HTTP_STATUS: Record<KernelErrorReason, number> = {
  invalid_lifecycle_state: 409,
};

/**
 * Kernel Error.
 */
export class KernelError extends BaseError<KernelErrorMeta> {
  /** Error code */
  readonly code: `kernel:${KernelErrorReason}`;

  /**
   * @param reason - The reason for the kernel error.
   * @param meta - Additional metadata for the error.
   */
  constructor(reason: KernelErrorReason, meta: Omit<KernelErrorMeta, "reason">) {
    super(REASON_MESSAGES[reason], {
      ...meta,
      httpStatus: REASON_HTTP_STATUS[reason],
      reason,
    });

    this.code = `kernel:${reason}`;
  }
}
