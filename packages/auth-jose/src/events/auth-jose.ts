/**
 * Auth JOSE events emitter.
 *
 * Technical, non-domain events.
 */
export interface AuthJoseEventEmitter {
  /**
   * Emitted when a token is successfully verified.
   */
  tokenVerified(payload: {
    /** Session identifier */
    sessionId: string;

    /** Assurance score */
    assuranceScore: number;

    /** Scopes */
    scopes?: string[];

    /** Issue time */
    issuedAt: number;

    /** Expiration time */
    expiresAt?: number;

    /** Token kind */
    kind: "access" | "refresh";
  }): void;

  /**
   * Emitted when a token is found to be invalid.
   */
  tokenInvalid(payload: {
    /**  */
    reason: string;

    /**  */
    rawError?: unknown;
  }): void;
}
