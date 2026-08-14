import type { ErrorMeta } from "@comity/primitives/errors";
import type { KernelLifecycleState } from "../setup/types.js";

import { BaseError } from "@comity/primitives/errors";

/**
 * Reasons for kernel errors.
 */
export type KernelErrorReason = "invalid_lifecycle_state";

/**
 * Kernel error metadata.
 */
export interface KernelErrorMeta extends ErrorMeta {
  /** Information about the kernel error */
  details: Readonly<{
    /** Lifecycle state */
    state: KernelLifecycleState;

    /** Action attempted */
    action: string;
  }>;
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
      httpStatus: REASON_HTTP_STATUS[reason],
      ...meta,
      reason,
    });

    this.code = `kernel:${reason}`;
  }
}
