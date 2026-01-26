import type { ErrorMeta } from "@comity/primitives/errors";

import { BaseError } from "@comity/primitives/errors";

/**
 * Metadata for a SessionRefreshNotAllowedError.
 */
export interface SessionRefreshNotAllowedErrorMeta extends ErrorMeta {
  /** Reason why the session refresh is not allowed */
  reason: string | undefined;
}

/**
 * Thrown when the refresh of a session is not allowed by policy.
 */
export class SessionRefreshNotAllowedError extends BaseError {
  readonly code = "auth:refresh_not_allowed";

  /**
   * @param meta - Optional error metadata
   */
  constructor(meta?: SessionRefreshNotAllowedErrorMeta) {
    super("Session refresh not allowed", {
      httpStatus: 401,
      ...meta,
    });
  }
}
