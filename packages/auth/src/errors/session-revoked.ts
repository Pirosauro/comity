import type { ErrorMeta } from "@comity/primitives/errors";

import { BaseError } from "@comity/primitives/errors";

/**
 * Metadata for a SessionRevokedError.
 */
export interface SessionRevokedErrorMeta extends ErrorMeta {
  /** Reason for the session revocation */
  reason?: string | undefined;
}

/**
 * Thrown when a session is revoked by policy.
 */
export class SessionRevokedError extends BaseError {
  readonly code = "auth:session_revoked";

  /**
   * @param meta - Optional error metadata
   */
  constructor(meta?: SessionRevokedErrorMeta) {
    super("Session revoked", {
      httpStatus: 401,
      ...meta,
    });
  }
}
