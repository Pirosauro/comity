/**
 * Interface for authentication refresh evaluation events.
 */
export interface AuthRefreshEvaluationEmitter {
  /** Emitted when a refresh token is validated. */
  refreshValidated(payload: {
    /** Session identifier. */
    sessionId: string;

    /** Timestamp when validation occurred. */
    at: number;
  }): void;

  /** Emitted when a refresh token is rejected. */
  refreshRejected(payload: {
    /** Session identifier. */
    sessionId: string;

    /** Reason for rejection. */
    reason: string;

    /** Timestamp when rejection occurred. */
    at: number;
  }): void;
}
