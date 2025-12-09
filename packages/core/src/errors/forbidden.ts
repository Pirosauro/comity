/**
 * Error thrown when access to a resource is denied due to insufficient permissions.
 *
 * @remarks
 * This error represents HTTP 403 Forbidden status conditions where the request
 * is authenticated but the user lacks sufficient privileges to access the resource.
 * It should be used when:
 *
 * - User is authenticated but lacks required permissions
 * - Resource access is restricted by role or ownership
 * - Action is not allowed in the current context
 * - Rate limits or quota restrictions are exceeded
 *
 * **HTTP Status Code**: 403 Forbidden
 *
 * **Difference from UnauthorizedError:**
 * - **UnauthorizedError (401)**: Authentication failed or missing
 * - **ForbiddenError (403)**: Authentication succeeded but authorization failed
 *
 * **Common Use Cases:**
 * - Role-based access control violations
 * - Resource ownership restrictions
 * - Feature flag limitations
 * - Rate limiting enforcement
 * - Admin-only functionality access
 *
 * @example
 * Role-based access control
 * ```typescript
 * import { ForbiddenError } from '@comity/core/errors';
 *
 * function requireAdmin(user: User) {
 *   if (!user.roles.includes('admin')) {
 *     throw new ForbiddenError('Administrator privileges required');
 *   }
 * }
 *
 * function requireOwnership(user: User, resource: Resource) {
 *   if (resource.ownerId !== user.id) {
 *     throw new ForbiddenError('You can only access your own resources');
 *   }
 * }
 * ```
 *
 * @example
 * Permission-based access control
 * ```typescript
 * app.delete('/posts/:id', async (c) => {
 *   const post = await getPost(c.req.param('id'));
 *   const user = c.get('user');
 *
 *   if (!user.can('delete', post)) {
 *     throw new ForbiddenError('You do not have permission to delete this post');
 *   }
 *
 *   await deletePost(post.id);
 *   return c.json({ success: true });
 * });
 * ```
 *
 * @example
 * Rate limiting and quota enforcement
 * ```typescript
 * // Rate limiting
 * if (await isRateLimited(user.id)) {
 *   throw new ForbiddenError('Rate limit exceeded. Please try again later.');
 * }
 *
 * // Quota enforcement
 * const usage = await getApiUsage(user.id);
 * if (usage.requests >= user.plan.maxRequests) {
 *   throw new ForbiddenError('API quota exceeded. Please upgrade your plan.');
 * }
 * ```
 *
 * @example
 * Error handling with specific status codes
 * ```typescript
 * app.use(async (c, next) => {
 *   try {
 *     await next();
 *   } catch (error) {
 *     if (error instanceof ForbiddenError) {
 *       return c.json({
 *         error: 'Forbidden',
 *         message: error.message
 *       }, 403);
 *     }
 *     throw error;
 *   }
 * });
 * ```
 */
export class ForbiddenError extends Error {
  readonly status = 403;

  constructor(message = "Forbidden") {
    super(message);

    this.name = "ForbiddenError";
  }
}
