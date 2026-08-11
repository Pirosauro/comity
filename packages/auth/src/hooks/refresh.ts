import type { SafeErrorPayload } from "@comity/primitives/errors";

import type { AuthSessionId } from "../value-objects/auth-session-id.js";

/**
 * Event observer interface for refresh evaluation events.
 */
export interface AuthRefreshEvaluationObserver {
  /** Emitted when a refresh token is validated. */
  onRefreshValidated(payload: {
    /** Session identifier */
    sessionId: AuthSessionId;

    /** Timestamp when validation occurred */
    at: number;
  }): void;

  /** Emitted when a refresh token is rejected. */
  onRefreshRejected(payload: {
    /** Session identifier */
    sessionId: AuthSessionId;

    /** Reason for rejection */
    reason: string;

    /** Timestamp when rejection occurred */
    at: number;

    /** Optional diagnostic error */
    error?: SafeErrorPayload;
  }): void;
}
