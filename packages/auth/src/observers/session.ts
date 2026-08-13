import type { AuthSessionId } from "../value-objects/auth-session-id.js";

/**
 * Event observer interface for session lifecycle events.
 */
export interface AuthSessionObserver {
  /** Emitted when a new session is created. */
  onSessionCreated(payload: {
    /** Session identifier */
    sessionId: AuthSessionId;

    /** Creation timestamp */
    createdAt: number;

    /** Assurance score */
    assuranceScore: number;
  }): void;

  /** Emitted when a session is revoked. */
  onSessionRevoked(payload: {
    /** Session identifier */
    sessionId: AuthSessionId;

    /** Reason for revocation */
    reason: string;

    /** Timestamp when the session was revoked */
    revokedAt: number;
  }): void;

  /** Emitted when a session is refreshed. */
  onSessionRefreshed(payload: {
    /** Session identifier */
    sessionId: AuthSessionId;

    /** Original session identifier */
    originalId: AuthSessionId;

    /** Timestamp when the session was refreshed */
    refreshedAt: number;

    /** New expiration timestamp after refresh */
    expiresAt?: number;
  }): void;

  /** Emitted when a step-up authentication is completed. */
  onStepUpCompleted(payload: {
    /** Session identifier */
    sessionId: AuthSessionId;

    /** Parent session identifier */
    parentId: AuthSessionId;

    /** New assurance score after step-up */
    assuranceScore: number;

    /** Timestamp when step-up was completed */
    at: number;
  }): void;
}
