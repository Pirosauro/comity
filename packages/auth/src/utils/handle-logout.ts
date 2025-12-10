import type { Context } from "hono";
import type { AuthModuleOptions } from "../types.js";
import { deleteCookie } from "hono/cookie";
import { DEFAULT_COOKIE_NAME } from "../constants.js";

/**
 * Completes user logout by clearing authentication cookies and context.
 *
 * This is a utility function that external modules can use in their
 * custom logout routes.
 *
 * @param c - Hono context
 * @param options - Auth module options
 *
 * @example
 * ```typescript
 * // In your custom logout route
 * app.post('/logout', async (c) => {
 *   // Optional: Add custom logout logic (audit logs, etc.)
 *   const user = c.get('user');
 *   await logUserActivity(user?.id, 'logout');
 *
 *   // Use auth module to complete logout
 *   handleLogout(c, authOptions);
 *   return c.json({ success: true, message: 'Logged out successfully' });
 * });
 * ```
 */
export function handleLogout(c: Context, options: AuthModuleOptions): void {
  // Clear authentication cookie
  const cookieName = options.cookie?.name || DEFAULT_COOKIE_NAME;

  deleteCookie(c, cookieName);

  // Clear user from context
  c.set("user", undefined);
}
