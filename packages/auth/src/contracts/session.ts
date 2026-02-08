import type { AuthSessionAssurance } from "./session-assurance.js";
import type { AuthSessionTransport } from "./session-transport.js";

/** Identifier for an authenticated session. */
export type AuthSessionId = string;

/**
 * Authenticated session domain model.
 *
 * @remarks
 * All nested contracts (including Assurance) represent stored state,
 * never derived or contextual evaluations.
 */
export interface AuthSession {
  /** Session identifier (invariant: unique, immutable) */
  readonly id: AuthSessionId;

  /** Session creation time (invariant: valid timestamp, immutable) */
  readonly createdAt: number;

  /** Hard expiration (invariant: > createdAt if present, immutable) */
  readonly expiresAt?: number;

  /** Last strong authentication time (invariant: >= createdAt if present) */
  readonly verifiedAt: number;

  /** Authentication assurance snapshot (invariant: non-null, valid) */
  readonly assurance: AuthSessionAssurance;

  /** Session transport mechanism (invariant: valid transport type) */
  readonly transport: AuthSessionTransport;

  /** Refresh capabilities (invariant: immutable if present) */
  readonly refresh?: {
    /** Session can be refreshed (invariant: boolean) */
    readonly enabled: boolean;

    /** Hard refresh expiration (invariant: > createdAt if present) */
    readonly expiresAt?: number;
  };

  /** Step-up metadata (invariant: immutable if present) */
  readonly stepUp?: {
    /** Session resulted from step-up (invariant: references valid session) */
    readonly parent: AuthSessionId;

    /** When step-up was completed (invariant: valid timestamp) */
    readonly at: number;
  };

  /** Authorization scopes (invariant: immutable array if present) */
  readonly scopes?: readonly string[];
}
