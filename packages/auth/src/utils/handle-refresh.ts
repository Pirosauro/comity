import type { Context } from "hono";
import type { AuthModuleOptions, JWTPayload } from "../types.js";
import { jwtVerify } from "jose";
import { TooManyRequestsError, UnauthorizedError } from "@comity/core/errors";
import { TokenExpiredError, TokenInvalidError } from "../errors/index.js";
import { extractToken } from "./extract-token.js";
import { handleLogin } from "./handle-login.js";

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
  if (payload.iat < now - (options.maxRefreshWindow || 7 * 24 * 60 * 60)) {
    throw new TokenExpiredError();
  }

  // Only allow refresh if token expires within next 15 minutes
  if (payload.exp > now + (options.minRefreshWindow || 15 * 60)) {
    throw new TooManyRequestsError("Token not eligible for refresh yet");
  }

  // Generate new token
  const current = await handleLogin(payload.user, c, options);

  return { outdated, current };
}
