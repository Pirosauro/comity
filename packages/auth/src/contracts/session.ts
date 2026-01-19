import type { AuthSessionAssurance } from "./session-assurance.js";

/** Session transport mechanisms */
export type AuthSessionId = string;

/**
 * Authenticated session domain model.
 *
 * This model is protocol-agnostic (no JWT, cookies, HTTP).
 */
export interface AuthSession {
  /** Session identifier (invariant: unique, immutable) */
  id: AuthSessionId;

  /** Session creation time (invariant: valid timestamp, immutable) */
  createdAt: number;

  /** Hard expiration (invariant: > createdAt if present, immutable) */
  expiresAt?: number;

  /** Last strong authentication time (invariant: >= createdAt if present) */
  verifiedAt?: number;

  /** Authentication assurance snapshot (invariant: non-null, valid) */
  assurance: AuthSessionAssurance;

  /** Session transport mechanism (invariant: valid transport type) */
  transport: string;

  /** Refresh capabilities (invariant: immutable if present) */
  refresh?: {
    /** Session can be refreshed (invariant: boolean) */
    enabled: boolean;

    /** Hard refresh expiration (invariant: > createdAt if present) */
    expiresAt?: number;
  };

  /** Step-up metadata (invariant: immutable if present) */
  stepUp?: {
    /** Session resulted from step-up (invariant: references valid session) */
    parent: AuthSessionId;

    /** When step-up was completed (invariant: valid timestamp) */
    at: number;
  };

  /** Authorization scopes (invariant: immutable array if present) */
  scopes?: string[];
}
