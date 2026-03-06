/**
 * Event emitter interface for authentication evaluation lifecycle.
 */
export interface AuthEvaluationEmitter {
  /** Emitted when a session is successfully validated. */
  onSessionValidated(payload: {
    /** Session identifier */
    readonly sessionId: string;

    /** Assurance score */
    readonly assuranceScore: number;

    /** Creation timestamp */
    readonly createdAt: number;

    /** Verification timestamp */
    readonly verifiedAt?: number;

    /** Expiration timestamp */
    readonly expiresAt?: number;

    /** Scopes */
    readonly scopes?: readonly string[];
  }): void;

  /** Emitted when a session is determined to be invalid. */
  onSessionInvalid(payload: {
    /** Session identifier, if available */
    readonly sessionId?: string;

    /** Timestamp when invalidation was detected */
    readonly at: number;

    /** Reason for invalidation */
    readonly reason?: string;

    /** Specific invariant violation, if applicable */
    readonly violation?: string;

    /** Policy that caused the invalidation, if applicable */
    readonly policy?: string;
  }): void;

  /** Emitted when a session is rejected due to assurance requirements. */
  onAssuranceRejected(payload: {
    /** Session identifier */
    readonly sessionId: string;

    /** Reason for the assurance requirement */
    readonly reason?: string;

    /** The policy that required the assurance */
    readonly policy?: string;
  }): void;
}
