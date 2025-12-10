import { UnauthorizedError } from "@comity/core/errors";

/**
 * Error thrown when a JWT token is invalid or malformed.
 *
 * @remarks
 * This error extends UnauthorizedError and is thrown when a token
 * cannot be parsed or validated due to structural issues.
 *
 * @example
 * ```typescript
 * try {
 *   await handleRefresh(c, options);
 * } catch (error) {
 *   if (error instanceof TokenInvalidError) {
 *     // Token is malformed, return 401
 *     return c.json({ error: 'Invalid token' }, 401);
 *   }
 * }
 * ```
 */
export class TokenInvalidError extends UnauthorizedError {
  constructor(message = "Token is invalid or malformed") {
    super(message);

    this.name = "TokenInvalidError";
  }
}
