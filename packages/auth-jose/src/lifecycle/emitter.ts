import type { AuthSessionId } from "@comity/auth";

/**
 * Auth JOSE events emitter.
 *
 * Technical, non-domain events.
 */
export interface AuthJoseEventEmitter {
  /**
   * Emitted when a token is successfully verified.
   */
  onTokenVerified(
    payload: Readonly<{
      /** Token kind */
      kind: "access" | "refresh";

      /** Session identifier */
      sessionId: AuthSessionId;

      /** Assurance score */
      assuranceScore: number;

      /** Scopes */
      scopes?: readonly string[];

      /** Issue time */
      issuedAt: number;

      /** Expiration time */
      expiresAt?: number;
    }>
  ): void;

  /**
   * Emitted when a token is found to be invalid.
   */
  onTokenInvalid(
    payload: Readonly<{
      /** Token kind */
      kind: "access" | "refresh";

      /** Reason for token invalidity */
      reason: string;

      /** Error message */
      message?: string;
    }>
  ): void;
}
