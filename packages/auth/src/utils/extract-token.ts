import type { Context } from "hono";
import type { AuthModuleOptions } from "../types.js";
import { getCookie } from "hono/cookie";
import {
  DEFAULT_AUTH_HEADER,
  DEFAULT_AUTH_HEADER_PREFIX,
} from "../constants.js";

/**
 * Extracts JWT token from request.
 *
 * @remarks
 * Attempts to extract JWT token from Authorization header first, then falls back
 * to cookies if configured. Supports configurable header names and prefixes.
 *
 * @param c - Hono context
 * @param options - Authentication module options
 * @returns JWT token string or null if not found
 *
 * @example
 * ```typescript
 * // Extract from Authorization header
 * const token = extractToken(c, { secret: "key" });
 * // token: "eyJhbGciOiJIUzI1NiIs..."
 *
 * // Extract from custom header
 * const token = extractToken(c, {
 *   secret: "key",
 *   header: { name: "x-auth-token", prefix: "Token " }
 * });
 * ```
 */
export function extractToken(
  c: Context,
  options: AuthModuleOptions
): string | null {
  try {
    // Try Authorization header first
    const header = c.req.header(options.header?.name || DEFAULT_AUTH_HEADER);

    if (
      header?.startsWith(options.header?.prefix || DEFAULT_AUTH_HEADER_PREFIX)
    ) {
      const token = header
        .slice((options.header?.prefix || DEFAULT_AUTH_HEADER_PREFIX).length)
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
