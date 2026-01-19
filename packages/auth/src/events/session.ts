/**
 * Interface for emitting authentication session events.
 */
export interface AuthSessionEmitter {
  /** Emitted when a new session is created. */
  sessionCreated(payload: {
    /** Session identifier */
    sessionId: string;

    /** Creation timestamp */
    createdAt: number;

    /** Assurance score */
    assuranceScore: number;
  }): void;

  /** Emitted when a session is revoked. */
  sessionRevoked(payload: {
    /** Session identifier. */
    sessionId: string;

    /** Reason for revocation. */
    reason: string;

    /** Timestamp when the session was revoked. */
    revokedAt: number;
  }): void;

  /** Emitted when a session is refreshed. */
  sessionRefreshed(payload: {
    /** Session identifier. */
    sessionId: string;

    /** Timestamp when the session was refreshed. */
    refreshedAt: number;

    /** New expiration timestamp after refresh. */
    newExpiresAt?: number;
  }): void;

  /** Emitted when a step-up authentication is completed. */
  stepUpCompleted(payload: {
    /** Session identifier. */
    sessionId: string;

    /** Parent session identifier. */
    parentSessionId: string;

    /** New assurance score after step-up. */
    newAssuranceScore: number;

    /** Timestamp when step-up was completed. */
    at: number;
  }): void;
}
