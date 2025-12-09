import type { AuthModuleOptions, AuthUser, JWTPayload } from "../types.js";
import { SignJWT } from "jose";

/**
 * Signs a JWT token for the given user.
 *
 * @param user - User data to encode in JWT
 * @param options - Auth module options
 * @returns Promise resolving to JWT token string
 *
 * @example
 * ```typescript
 * const helpers = new AuthHelpers({ secret: 'your-secret' });
 * const token = await helpers.signToken({
 *   id: 'user-123',
 *   email: 'user@example.com'
 * });
 * ```
 */
export async function signToken(
  user: AuthUser,
  options: AuthModuleOptions
): Promise<string> {
  const payload: JWTPayload = {
    sub: user.id,
    iat: Math.floor(Date.now() / 1000),
    user,
  };
  const jwt = new SignJWT(payload)
    .setProtectedHeader({ alg: options.algorithm || "HS256" })
    .setIssuedAt()
    .setExpirationTime(
      Math.floor(Date.now() / 1000) + (options.lifetime || 60 * 60)
    )
    .setSubject(user.id);

  // Set issuer if configured
  if (options.issuer) {
    jwt.setIssuer(options.issuer);
  }

  // Set audience if configured
  if (options.audience) {
    jwt.setAudience(options.audience);
  }

  // Encode secret
  const secret = new TextEncoder().encode(options.secret);

  return await jwt.sign(secret);
}
