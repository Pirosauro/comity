import type { ErrorMeta } from "@comity/core/errors";

import { BaseError } from "@comity/core/errors";

export const AUTH_TOKEN_INVALID_REASONS = {
  TOKEN_INVALID: "token_invalid",
  TOKEN_EXPIRED: "token_expired",
  TOKEN_NOT_ACTIVE: "token_not_active",
};

/**
 * Reasons for AuthTokenInvalidError.
 */
export type AuthTokenInvalidReason =
  (typeof AUTH_TOKEN_INVALID_REASONS)[keyof typeof AUTH_TOKEN_INVALID_REASONS];

/**
 * Metadata for AuthTokenInvalidError.
 */
export interface AuthTokenInvalidErrorMeta extends ErrorMeta {
  /** Additional details about the invalidity */
  reason?: AuthTokenInvalidReason;
}

/**
 * Invalid authentication token error.
 */
export class AuthTokenInvalidError extends BaseError {
  readonly code = "auth:token_invalid";

  /**
   * @param meta Optional error metadata
   */
  constructor(meta?: AuthTokenInvalidErrorMeta) {
    super("Invalid authentication token", { httpStatus: 401, ...meta });
  }
}
