/**
 * Event emitter interface for session lifecycle events.
 */
export interface AuthSessionEmitter {
  /** Emitted when a new session is created. */
  onSessionCreated(payload: {
    /** Session identifier */
    sessionId: string;

    /** Creation timestamp */
    createdAt: number;

    /** Assurance score */
    assuranceScore: number;
  }): void;

  /** Emitted when a session is revoked. */
  onSessionRevoked(payload: {
    /** Session identifier */
    sessionId: string;

    /** Reason for revocation */
    reason: string;

    /** Timestamp when the session was revoked */
    revokedAt: number;
  }): void;

  /** Emitted when a session is refreshed. */
  onSessionRefreshed(payload: {
    /** Session identifier */
    sessionId: string;

    /** Original session identifier */
    originalId: string;

    /** Timestamp when the session was refreshed */
    refreshedAt: number;

    /** New expiration timestamp after refresh */
    expiresAt?: number;
  }): void;

  /** Emitted when a step-up authentication is completed. */
  onStepUpCompleted(payload: {
    /** Session identifier */
    sessionId: string;

    /** Parent session identifier */
    parentId: string;

    /** New assurance score after step-up */
    assuranceScore: number;

    /** Timestamp when step-up was completed */
    at: number;
  }): void;
}
