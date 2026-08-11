import type { SafeErrorPayload } from "@comity/primitives/errors";

import type { AuthSessionId } from "../value-objects/auth-session-id.js";

/**
 * Event observer interface for authentication evaluation lifecycle.
 */
export interface AuthEvaluationObserver {
  /** Emitted when a session is successfully validated. */
  onSessionValidated(payload: {
    /** Session identifier */
    sessionId: AuthSessionId;

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
  onSessionInvalid(payload: {
    /** Session identifier, if available */
    sessionId?: AuthSessionId;

    /** Timestamp when invalidation was detected */
    at: number;

    /** Reason for invalidation */
    reason?: string;

    /** Specific invariant violation, if applicable */
    violation?: string;

    /** Policy that caused the invalidation, if applicable */
    policy?: string;

    /** Optional diagnostic error */
    error?: SafeErrorPayload;
  }): void;

  /** Emitted when a session is rejected due to assurance requirements. */
  onAssuranceRejected(
    payload: Readonly<{
      /** Session identifier */
      sessionId: AuthSessionId;

      /** Reason for the assurance requirement */
      reason?: string;

      /** The policy that required the assurance, if applicable */
      policy?: string;

      /** Optional diagnostic error */
      error?: SafeErrorPayload;
    }>
  ): void;
}
