import type { ErrorMeta } from "@comity/core/errors";

import { BaseError } from "@comity/core/errors";

/**
 * Metadata for a SessionRevokedError
 */
export interface InvalidSessionErrorMeta<T extends string> extends ErrorMeta {
  /** Reason for the session revocation */
  reason?: T | undefined;
}

/**
 * Thrown when a session is invalid.
 */
export class InvalidSessiondError<T extends string> extends BaseError {
  readonly code = "auth:session_invalid";

  constructor(meta?: InvalidSessionErrorMeta<T>) {
    super("Invalid session", {
      httpStatus: 401,
      meta,
    });
  }
}
