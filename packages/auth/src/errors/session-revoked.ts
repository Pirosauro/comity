import type { ErrorMeta } from "@comity/core/errors";

import { BaseError } from "@comity/core/errors";

/**
 * Metadata for a SessionRevokedError
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

  constructor(meta?: SessionRevokedErrorMeta) {
    super("Session revoked", {
      httpStatus: 401,
      ...meta,
    });
  }
}
