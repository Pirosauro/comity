import type { Context } from "hono";
import type { AuthModuleOptions, JWTPayload } from "../types.js";
import { jwtVerify } from "jose";
import { TooManyRequestsError, UnauthorizedError } from "@comity/core/errors";
import { TokenExpiredError, TokenInvalidError } from "../errors/index.js";
import { extractToken } from "./extract-token.js";
import { signToken } from "./sign-token.js";
import {
  DEFAULT_MAX_REFRESH_WINDOW,
  DEFAULT_MIN_REFRESH_WINDOW,
} from "../constants.js";

/**
 * Handles JWT token refresh logic.
 *
 * @remarks
 * Validates the current token and generates a new one if eligible for refresh.
 * Tokens can only be refreshed if they were issued within the maximum refresh
 * window and expire within the minimum refresh window.
 *
 * @param c - Hono context
 * @param options - Authentication module options
 * @returns Object containing old and new token strings
 * @throws {UnauthorizedError} If no token is found
 * @throws {TokenInvalidError} If token payload is malformed
 * @throws {TokenExpiredError} If token is too old to refresh
 * @throws {TooManyRequestsError} If token is not eligible for refresh yet
 *
 * @example
 * ```typescript
 * try {
 *   const { outdated, current } = await handleRefresh(c, options);
 *   // Set new token in response
 *   setCookie(c, "auth-token", current);
 * } catch (error) {
 *   if (error instanceof TokenExpiredError) {
 *     // Redirect to login
 *   }
 * }
 * ```
 */
export async function handleRefresh(c: Context, options: AuthModuleOptions) {
  const outdated = extractToken(c, options);

  if (!outdated) {
    throw new UnauthorizedError("No token found to refresh");
  }

  const secret = new TextEncoder().encode(options.secret);

  // Verify JWT token
  const { payload } = await jwtVerify<JWTPayload>(outdated, secret, {
    issuer: options.issuer,
    audience: options.audience,
  });

  const now = Math.floor(Date.now() / 1000);

  // Check if token is expired
  if (!payload.exp || !payload.iat) {
    throw new TokenInvalidError();
  }

  // Only allow refresh if issued within last 7 days
  if (
    payload.iat <
    now - (options.maxRefreshWindow || DEFAULT_MAX_REFRESH_WINDOW)
  ) {
    throw new TokenExpiredError();
  }

  // Only allow refresh if token expires within next 15 minutes
  if (
    payload.exp >
    now + (options.minRefreshWindow || DEFAULT_MIN_REFRESH_WINDOW)
  ) {
    throw new TooManyRequestsError("Token not eligible for refresh yet");
  }

  // Generate new token (without setting cookies for refresh)
  const current = await signToken(payload.user, options);

  return { outdated, current };
}
