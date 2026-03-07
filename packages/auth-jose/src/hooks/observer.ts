import type { AuthSessionId } from "@comity/auth";
import type { SafeErrorPayload } from "@comity/primitives/error";

/**
 * Auth JOSE events emitter.
 *
 * Technical, non-domain events.
 */
export interface AuthJoseEventObserver {
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

      /** Optional diagnostic error */
      error?: SafeErrorPayload;
    }>
  ): void;
}
