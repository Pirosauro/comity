/**
 * Error thrown when a requested resource cannot be found.
 *
 * @remarks
 * This error represents HTTP 404 Not Found status conditions where the requested
 * resource does not exist or cannot be located. It should be used when:
 *
 * - Database records are not found by ID
 * - API endpoints don't exist
 * - Files or assets are missing
 * - Services are not registered in containers
 * - Routes are not defined
 *
 * **HTTP Status Code**: 404 Not Found
 *
 * **Usage Guidelines:**
 * - Use specific, helpful error messages when possible
 * - Include relevant identifiers (IDs, names) in the message
 * - Avoid exposing sensitive information in error messages
 * - Consider if the resource truly doesn't exist vs. access is forbidden
 *
 * **Common Use Cases:**
 * - Database entity lookup failures
 * - Service container resolution failures
 * - File system operations
 * - API route resolution
 * - Resource discovery
 *
 * @example
 * Database entity lookup
 * ```typescript
 * import { NotFoundError } from '@comity/core/errors';
 *
 * async function getUserById(id: string): Promise<User> {
 *   const user = await db.users.findById(id);
 *
 *   if (!user) {
 *     throw new NotFoundError(`User with ID "${id}" not found`);
 *   }
 *
 *   return user;
 * }
 * ```
 *
 * @example
 * API route handlers
 * ```typescript
 * app.get('/users/:id', async (c) => {
 *   try {
 *     const user = await getUserById(c.req.param('id'));
 *     return c.json({ user });
 *   } catch (error) {
 *     if (error instanceof NotFoundError) {
 *       return c.json({ error: error.message }, 404);
 *     }
 *     throw error;
 *   }
 * });
 * ```
 *
 * @example
 * Service container usage
 * ```typescript
 * // This is how it's used in the Container class
 * public get<T>(key: string): T {
 *   const factory = this.factories.get(key);
 *
 *   if (!factory) {
 *     throw new NotFoundError(`Service "${key}" is not registered`);
 *   }
 *
 *   return factory() as T;
 * }
 * ```
 *
 * @example
 * File operations
 * ```typescript
 * async function readConfigFile(path: string): Promise<Config> {
 *   try {
 *     const content = await fs.readFile(path, 'utf-8');
 *     return JSON.parse(content);
 *   } catch (error) {
 *     if (error.code === 'ENOENT') {
 *       throw new NotFoundError(`Configuration file not found: ${path}`);
 *     }
 *     throw error;
 *   }
 * }
 * ```
 *
 * @example
 * Resource relationships
 * ```typescript
 * async function getPostComments(postId: string) {
 *   const post = await getPost(postId);
 *   if (!post) {
 *     throw new NotFoundError(`Post with ID "${postId}" not found`);
 *   }
 *
 *   return await getCommentsByPostId(postId);
 * }
 * ```
 *
 * @example
 * Batch operations with partial failures
 * ```typescript
 * async function getMultipleUsers(ids: string[]): Promise<User[]> {
 *   const users: User[] = [];
 *   const notFound: string[] = [];
 *
 *   for (const id of ids) {
 *     try {
 *       const user = await getUserById(id);
 *       users.push(user);
 *     } catch (error) {
 *       if (error instanceof NotFoundError) {
 *         notFound.push(id);
 *       } else {
 *         throw error;
 *       }
 *     }
 *   }
 *
 *   if (notFound.length > 0) {
 *     console.warn(`Users not found: ${notFound.join(', ')}`);
 *   }
 *
 *   return users;
 * }
 * ```
 */
export class NotFoundError extends Error {
  readonly status = 404;

  constructor(message = "Not Found") {
    super(message);

    this.name = "NotFoundError";
  }
}
