import { UnauthorizedError } from "@comity/core/errors";

/**
 * Error thrown when a JWT token has expired and cannot be refreshed.
 *
 * @remarks
 * This error extends UnauthorizedError and is thrown when attempting to
 * refresh a token that is too old (beyond the maximum refresh window).
 *
 * @example
 * ```typescript
 * try {
 *   await handleRefresh(c, options);
 * } catch (error) {
 *   if (error instanceof TokenExpiredError) {
 *     // Token is too old to refresh, redirect to login
 *     return c.redirect('/login');
 *   }
 * }
 * ```
 */
export class TokenExpiredError extends UnauthorizedError {
  constructor(message = "Token is expired") {
    super(message);

    this.name = "TokenExpiredError";
  }
}
