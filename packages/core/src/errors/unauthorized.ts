/**
 * Error thrown when authentication is required but not provided or invalid.
 *
 * @remarks
 * This error represents HTTP 401 Unauthorized status conditions where the request
 * lacks valid authentication credentials. It should be used when:
 *
 * - No authentication token is provided
 * - Authentication token is invalid or expired
 * - Authentication method is not supported
 * - User credentials are incorrect
 *
 * **HTTP Status Code**: 401 Unauthorized
 *
 * **Common Use Cases:**
 * - Missing Authorization header
 * - Expired JWT tokens
 * - Invalid API keys
 * - Failed login attempts
 * - Session timeouts
 *
 * @example
 * Basic usage in authentication middleware
 * ```typescript
 * import { UnauthorizedError } from '@comity/core/errors';
 *
 * function validateToken(token: string) {
 *   if (!token) {
 *     throw new UnauthorizedError('Authorization token is required');
 *   }
 *
 *   if (!isValidToken(token)) {
 *     throw new UnauthorizedError('Invalid or expired token');
 *   }
 * }
 * ```
 *
 * @example
 * Error handling in route handlers
 * ```typescript
 * app.get('/protected', async (c) => {
 *   try {
 *     const user = await getCurrentUser(c);
 *     return c.json({ user });
 *   } catch (error) {
 *     if (error instanceof UnauthorizedError) {
 *       return c.json({ error: error.message }, 401);
 *     }
 *     throw error;
 *   }
 * });
 * ```
 *
 * @example
 * Custom authentication scenarios
 * ```typescript
 * // API key validation
 * if (!request.headers['x-api-key']) {
 *   throw new UnauthorizedError('API key required');
 * }
 *
 * // Session validation
 * if (!session || session.expired) {
 *   throw new UnauthorizedError('Please log in to continue');
 * }
 *
 * // Multi-factor authentication
 * if (user.mfaEnabled && !mfaToken) {
 *   throw new UnauthorizedError('Multi-factor authentication required');
 * }
 * ```
 */
export class UnauthorizedError extends Error {
  readonly status = 401;

  constructor(message = "Unauthorized") {
    super(message);

    this.name = "UnauthorizedError";
  }
}
