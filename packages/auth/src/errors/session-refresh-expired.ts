import type { ErrorMeta } from "@comity/primitives/errors";

import { BaseError } from "@comity/primitives/errors";

/**
 * Thrown when the session refresh window has expired.
 */
export class SessionRefreshExpiredError extends BaseError {
  readonly code = "auth:refresh_expired";

  /**
   * @param meta - Optional error metadata
   */
  constructor(meta?: ErrorMeta) {
    super("Session refresh has expired", {
      httpStatus: 401,
      ...meta,
    });
  }
}
