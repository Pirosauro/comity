import type { AuthSession } from "@comity/auth";

/**
 * Token service interface.
 *
 * Adapter-level abstraction over JOSE.
 */
export interface AuthTokenService {
  /**
   * Signs a new access token.
   */
  signAccessToken(session: AuthSession): Promise<string>;

  /**
   * Signs a refresh token.
   */
  signRefreshToken(session: AuthSession): Promise<string>;

  /**
   * Verifies an access token.
   *
   * @throws AuthTokenInvalidError
   * @throws AuthTokenExpiredError
   */
  verifyAccessToken(token: string): Promise<AuthSession>;

  /**
   * Verifies a refresh token.
   *
   * @throws AuthTokenInvalidError
   * @throws AuthTokenExpiredError
   */
  verifyRefreshToken(token: string): Promise<AuthSession>;
}
