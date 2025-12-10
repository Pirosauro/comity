import type { Context } from "hono";
import type { AuthModuleOptions, AuthUser } from "../types.js";
import { setCookie } from "hono/cookie";
import { signToken } from "./sign-token.js";
import {
  DEFAULT_COOKIE_NAME,
  DEFAULT_COOKIE_PATH,
  DEFAULT_COOKIE_SAMESITE,
} from "../constants.js";

/**
 * Creates a JWT token and sets up authentication for a validated user.
 *
 * This is a utility function that external modules can use after
 * they've validated credentials in their own way.
 *
 * @param user - Validated user to authenticate
 * @param c - Hono context
 * @param options - Auth module options
 * @returns Promise resolving to JWT token
 *
 * @example
 * ```typescript
 * // In your custom login route
 * app.post('/login', async (c) => {
 *   const { email, password } = await c.req.json();
 *
 *   // Your validation logic
 *   const user = await validateEmailPassword(email, password);
 *   if (!user) {
 *     return c.json({ error: 'Invalid credentials' }, 401);
 *   }
 *
 *   // Use auth module to complete login
 *   const token = await completeLogin(c, user, authOptions);
 *   return c.json({ success: true, token, user });
 * });
 *
 * // Or for social login
 * app.post('/login/google', async (c) => {
 *   const { googleToken } = await c.req.json();
 *   const user = await validateGoogleToken(googleToken);
 *
 *   const token = await handleLogin(user, c, authOptions);
 *   return c.json({ success: true, token, user });
 * });
 * ```
 */
export async function handleLogin(
  user: AuthUser,
  c: Context,
  options: AuthModuleOptions
): Promise<string> {
  const token = await signToken(user, options);

  // Set cookie if configured
  if (options.cookie?.name) {
    setCookie(c, options.cookie.name, token, {
      httpOnly: options.cookie.httpOnly ?? true,
      secure: options.cookie.secure ?? true,
      sameSite: options.cookie.sameSite || DEFAULT_COOKIE_SAMESITE,
      domain: options.cookie.domain,
      path: options.cookie.path || DEFAULT_COOKIE_PATH,
      maxAge: options.cookie.maxAge,
    });
  }

  // Set user in context for immediate use
  c.set("user", user);

  return token;
}
