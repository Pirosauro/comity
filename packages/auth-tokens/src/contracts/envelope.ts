import type { AuthSession } from "@comity/auth";

/**
 * Data structure returned when multiple tokens are issued.
 */
export interface AuthTokenEnvelope {
  /**
   * The issued access token.
   */
  readonly accessToken: string;

  /**
   * The issued refresh token, if applicable.
   */
  readonly refreshToken?: string;

  /** The session associated with the issued tokens. */
  readonly session: AuthSession;
}
