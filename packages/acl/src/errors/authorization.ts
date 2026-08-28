import type { ErrorMeta } from "@comity/primitives/errors";

import { BaseError } from "@comity/primitives/errors";

/**
 * Reasons for authorization errors.
 *
 * - `internal_error`: An infrastructure or provider failure occurred during evaluation.
 *
 * Normal authorization denials are represented as a successful `Result`
 * with `AuthorizationDecision.allowed === false`, not as errors.
 * Only infrastructure failures yield `internal_error`.
 */
export type AuthorizationErrorReason = "internal_error";

/**
 * Metadata attached to authorization errors.
 */
export interface AuthorizationErrorMeta extends Omit<ErrorMeta, "reason"> {
  /** Error reason. */
  readonly reason: AuthorizationErrorReason;
}

const REASON_MESSAGES: Record<AuthorizationErrorReason, string> = {
  internal_error: "Authorization infrastructure error",
};

const REASON_HTTP_STATUS: Record<AuthorizationErrorReason, number> = {
  internal_error: 500,
};

/**
 * Authorization error with typed reasons.
 *
 * Represents a failure at the authorization contract boundary.
 * Normal authorization denials are represented as successful `Result`
 * values with `AuthorizationDecision.allowed === false`, not as errors.
 * This error class is used for infrastructure failures and contract violations.
 */
export class AuthorizationError extends BaseError<AuthorizationErrorMeta> {
  /** Namespaced error code. */
  readonly code: `authorization:${AuthorizationErrorReason}`;

  /**
   * Creates an AuthorizationError.
   *
   * @param reason - The reason for the authorization error.
   * @param meta - Additional metadata for the error.
   */
  constructor(reason: AuthorizationErrorReason, meta?: Omit<ErrorMeta, "reason">) {
    super(REASON_MESSAGES[reason], {
      httpStatus: REASON_HTTP_STATUS[reason],
      reason,
      ...meta,
    });

    this.name = "AuthorizationError";
    this.code = `authorization:${reason}`;
  }
}