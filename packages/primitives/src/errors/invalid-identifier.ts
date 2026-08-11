import type { ErrorMeta } from "./types.js";

import { BaseError } from "./base.js";

/**
 * Reasons for `InvalidIdentifierError`.
 */
export type InvalidIdentifierErrorReason = "empty";

/**
 * Metadata for `InvalidIdentifierError`.
 */
export interface InvalidIdentifierErrorMeta extends ErrorMeta {
  /** The reason for the invalid identifier error. */
  readonly reason: InvalidIdentifierErrorReason;

  /** Details about the invalid identifier. */
  readonly details: Readonly<{
    /** Identifier Value Object kind (e.g. "CustomerId"). */
    readonly kind: string;
  }>;
}

/** Error message for invalid identifier errors. */
const REASON_MESSAGES: Record<InvalidIdentifierErrorReason, string> = {
  empty: "Empty identifier is not allowed",
};

/** Error HTTP status for invalid identifier errors. */
const REASON_HTTP_STATUS: Record<InvalidIdentifierErrorReason, number> = {
  empty: 500,
};

/**
 * Thrown when a Comity-owned identifier Value Object is constructed with an
 * invalid value.
 */
export class InvalidIdentifierError extends BaseError<InvalidIdentifierErrorMeta> {
  /** Error code. */
  readonly code: `value-object:${InvalidIdentifierErrorReason}`;

  /**
   * @param reason - The reason for the invalid identifier error.
   * @param meta - Additional metadata for the error.
   */
  constructor(
    reason: InvalidIdentifierErrorReason,
    meta: Omit<InvalidIdentifierErrorMeta, "reason">
  ) {
    super(REASON_MESSAGES[reason], {
      httpStatus: REASON_HTTP_STATUS[reason],
      ...meta,
      reason,
    });

    this.code = `value-object:${reason}`;
  }
}
