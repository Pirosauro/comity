import type { Context } from "hono";
import type { AuthModuleOptions } from "../types.js";
import { getCookie } from "hono/cookie";

/**
 * Extracts JWT token from request.
 */
export function extractToken(
  c: Context,
  options: AuthModuleOptions
): string | null {
  try {
    // Try Authorization header first
    const header = c.req.header(options.header?.name || "authorization");

    if (header?.startsWith(options.header?.prefix || "Bearer ")) {
      const token = header
        .slice((options.header?.prefix || "Bearer ").length)
        .trim();
      return token || null;
    }

    // Try cookie if configured
    if (options.cookie?.name) {
      const cookie = getCookie(c, options.cookie.name);

      return cookie?.trim() || null;
    }
  } catch (error) {
    // Gracefully handle any errors during token extraction
    return null;
  }

  return null;
}
