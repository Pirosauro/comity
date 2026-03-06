import type { ErrorMeta } from "../error/types.js";
import type { PropertyKey } from "./types.js";

import { BaseError } from "../error/base.js";

/**
 * Metadata for DI Container errors.
 */
export interface DiContainerErrorMeta extends ErrorMeta {
  /**
   * The reason for the DI Container error.
   */
  reason: DiContainerErrorReason;

  /**
   * The name of the service involved in the error, if applicable.
   */
  service: PropertyKey;
}

/**
 * Reasons for DI Container errors.
 */
export type DiContainerErrorReason = "already_registered" | "not_registered";

/** Error messages for DI Container errors */
const REASON_MESSAGES: Record<DiContainerErrorReason, string> = {
  already_registered: "Service already registered",
  not_registered: "Service not registered",
};

/**
 * Dependency Injection Container Error.
 */
export class DiContainerError extends BaseError<DiContainerErrorMeta> {
  /** Error code */
  readonly code: `di-container:${DiContainerErrorReason}`;

  /**
   * @param reason - The reason for the DI Container error.
   * @param meta - Additional metadata for the error.
   */
  constructor(reason: DiContainerErrorReason, meta: Omit<DiContainerErrorMeta, "reason">) {
    super(REASON_MESSAGES[reason], {
      ...meta,
      reason,
    });

    this.code = `di-container:${reason}`;
  }
}
