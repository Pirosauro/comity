import type { ErrorMeta } from "@comity/primitives/errors";

import { BaseError } from "@comity/primitives/errors";

export const INVALID_JWT_REASONS = {
  JWT_TOKEN_EXPIRED: "jwt_token_expired",
  JWT_TOKEN_NOT_ACTIVE: "jwt_token_not_active",
  JWT_INVALID_ISSUER: "jwt_invalid_issuer",
  JWT_INVALID_AUDIENCE: "jwt_invalid_audience",
  JWT_TOKEN_INVALID: "jwt_token_invalid",
  JWT_SESSION_INVALID: "jwt_session_invalid",
  JWT_INVALID_CREDENTIAL: "jwt_invalid_credential",
  JWT_REFRESH_NOT_ALLOWED: "jwt_refresh_not_allowed",
};

/**
 * Reasons for InvalidJwtError.
 */
export type InvalidJwtReason = (typeof INVALID_JWT_REASONS)[keyof typeof INVALID_JWT_REASONS];

/**
 * Metadata for InvalidJwtError.
 */
export interface InvalidJwtErrorMeta extends ErrorMeta {
  /** Additional details about the invalidity */
  reason?: InvalidJwtReason;
}

/**
 * Error indicating an invalid JWT.
 */
export class InvalidJwtError extends BaseError {
  readonly code = "auth:jose_invalid_jwt";

  /**
   * @param meta Optional error metadata
   */
  constructor(meta?: InvalidJwtErrorMeta) {
    super("Invalid JWT", { httpStatus: 401, ...meta });
  }
}
