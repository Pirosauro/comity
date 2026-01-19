/**
 * Interface for emitting authentication events.
 */
export interface AuthEvaluationEmitter {
  /** Emitted when a session is successfully validated. */
  sessionValidated(payload: {
    /** Session identifier  */
    sessionId: string;

    /** Assurance score */
    assuranceScore: number;

    /** Creation timestamp */
    createdAt: number;

    /** Verification timestamp */
    verifiedAt?: number;

    /** Expiration timestamp */
    expiresAt?: number;

    /** Scopes */
    scopes?: string[];
  }): void;

  /** Emitted when a session is determined to be invalid. */
  sessionInvalid(payload: {
    /** Session identifier, if available. */
    sessionId?: string;

    /** Timestamp */
    at: number;

    /** Reason for invalidation. */
    reason?: string;
  }): void;

  /** Emitted when session rejected. */
  sessionRejected(payload: {
    /** Session identifier. */
    sessionId: string;

    /** Reason for the assurance requirement. */
    reason?: string;

    /** The policy that required the assurance. */
    policy?: string;
  }): void;
}
