import type { Result } from "@comity/primitives/result";
import type { AuthError } from "../errors/auth.js";
import type { AuthSession } from "./session.js";

/**
 * Token service interface.
 *
 * Adapter-level abstraction over JOSE.
 */
export interface AuthTokenService {
  /**
   * Signs a new access token.
   */
  signAccessToken(session: AuthSession): Promise<Result<string, AuthError, "ok">>;

  /**
   * Signs a refresh token.
   */
  signRefreshToken(session: AuthSession): Promise<Result<string, AuthError, "ok">>;

  /**
   * Verifies an access token.
   *
   * @param token - The access token to verify
   *
   * @return The result of the verification, containing either the auth session or an auth error
   */
  verifyAccessToken(token: string): Promise<Result<AuthSession, AuthError, "ok">>;

  /**
   * Verifies a refresh token.
   *
   * @param token - The refresh token to verify
   *
   * @return The result of the verification, containing either the auth session or an auth error
   */
  verifyRefreshToken(token: string): Promise<Result<AuthSession, AuthError, "ok">>;
}
