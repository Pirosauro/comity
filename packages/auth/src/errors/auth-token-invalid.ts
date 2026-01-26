import type { ErrorMeta } from "@comity/primitives/errors";

import { BaseError } from "@comity/primitives/errors";

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
 * Thrown when the authentication token is invalid.
 */
export class AuthTokenInvalidError extends BaseError {
  readonly code = "auth:token_invalid";

  /**
   * @param meta - Optional error metadata
   */
  constructor(meta?: AuthTokenInvalidErrorMeta) {
    super("Invalid authentication token", { httpStatus: 401, ...meta });
  }
}
