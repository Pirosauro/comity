import type { ErrorMeta } from "./base.js";
import { BaseError } from "./base.js";

/**
 * Error thrown when authentication is required but missing or invalid.
 *
 * @remarks
 * This error corresponds to HTTP 401 status and is typically thrown when
 * requests lack proper authentication credentials or when provided
 * credentials are invalid or expired.
 *
 * @example
 * ```typescript
 * // Missing authentication
 * if (!request.headers.authorization) {
 *   throw new UnauthorizedError();
 * }
 *
 * // Invalid token
 * try {
 *   const user = verifyToken(token);
 * } catch (error) {
 *   throw new UnauthorizedError("Invalid or expired token", {
 *     details: { tokenType: "bearer" }
 *   });
 * }
 *
 * // Session expired
 * if (session.expired) {
 *   throw new UnauthorizedError("Session expired", {
 *     details: { sessionId: session.id }
 *   });
 * }
 * ```
 */
export class UnauthorizedError extends BaseError {
  readonly code = "UNAUTHORIZED";

  /**
   * Creates a new UnauthorizedError.
   *
   * @param message - Human-readable error message (defaults to "Authentication required")
   * @param meta - Additional error metadata (auth method, context, etc.)
   */
  constructor(message = "Authentication required", meta?: ErrorMeta) {
    super(message, {
      httpStatus: 401,
      ...meta,
    });
  }
}
