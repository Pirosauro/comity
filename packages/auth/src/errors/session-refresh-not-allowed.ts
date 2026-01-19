import type { ErrorMeta } from "@comity/core/errors";

import { BaseError } from "@comity/core/errors";

/**
 * Metadata for a SessionRefreshNotAllowedError
 */
export interface SessionRefreshNotAllowedErrorMeta extends ErrorMeta {
  /** Reason why the session refresh is not allowed */
  reason: string | undefined;
}

/**
 * Thrown when the refresh of a session is not allowed.
 */
export class SessionRefreshNotAllowedError extends BaseError {
  readonly code = "auth:refresh_not_allowed";

  /**
   * @param meta Error metadata
   */
  constructor(meta?: SessionRefreshNotAllowedErrorMeta) {
    super("Session refresh not allowed", {
      httpStatus: 401,
      ...meta,
    });
  }
}
