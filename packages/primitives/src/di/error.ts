import type { ErrorMeta } from "../error/types.js";

import { BaseError } from "../error/base.js";

/**
 * Reasons for DI Container errors.
 */
export type ContainerErrorReason = "already_registered" | "not_registered";

/** Error messages for DI Container errors */
const REASON_MESSAGES: Record<ContainerErrorReason, string> = {
  already_registered: "Service already registered",
  not_registered: "Service not registered",
};

/**
 * Dependency Injection Container Error.
 */
export class ContainerError extends BaseError {
  /** Error code */
  readonly code: `di-container:${ContainerErrorReason}`;

  /**
   * @param reason - The reason for the DI Container error.
   * @param meta - Additional metadata for the error.
   */
  constructor(reason: ContainerErrorReason, meta?: ErrorMeta) {
    super(REASON_MESSAGES[reason], {
      ...meta,
      reason,
    });

    this.code = `di-container:${reason}`;
  }
}
