import type {
  AuthMethod,
  AuthSessionTransport,
  AuthIdentityProof,
} from "./constants.js";

/**
 * Core type exports for the auth module.
 *
 * Invariants:
 * - All types are immutable after construction
 * - Result types enforce error handling (no exceptions for domain errors)
 */
export type { AuthMethod, AuthSessionTransport, AuthIdentityProof };

/**
 * Success result wrapper.
 *
 * Invariants:
 * - ok is always true
 * - value is present and non-null
 */
export type Ok<T> = { ok: true; value: T };

/**
 * Failure result wrapper.
 *
 * Invariants:
 * - ok is always false
 * - reason is a non-empty string from defined constants
 * - meta is optional but immutable if present
 */
export type Ko<T extends string> = {
  ok: false;
  reason: T;
  meta?: Record<string, unknown>;
};

/**
 * Union type for operation results.
 *
 * Invariants:
 * - Exactly one of ok:true or ok:false is present
 * - Type safety prevents accessing value on failure or reason on success
 */
export type Result<T, E extends string> = Ok<T> | Ko<E>;

/**
 * Utility type to extract success value from Result.
 */
export type ResultValue<T> = T extends { ok: true; value: infer V } ? V : never;

/**
 * User identifier type.
 *
 * Invariants:
 * - Non-empty string
 * - Unique across the system
 * - Immutable after assignment
 */
export type UserId = string;

/**
 * Session identifier type.
 *
 * Invariants:
 * - Non-empty string
 * - Unique across all sessions
 * - Cryptographically secure random value
 */
export type SessionId = string;

/**
 * Authenticated user representation.
 *
 * Invariants:
 * - id is required and immutable
 * - Additional properties are optional but immutable after creation
 */
export type AuthUser<U extends Record<string, unknown> = {}> = {
  id: UserId;
} & U;

/**
 * Authentication assurance snapshot.
 *
 * Invariants:
 * - methods array is non-empty and contains only valid AuthMethod values
 * - score is a non-negative number derived from policy
 * - evaluatedAt is a valid timestamp (seconds since epoch)
 * - context is immutable after creation
 */
export interface AuthAssurance {
  /** Authentication methods used (invariant: non-empty array) */
  methods: AuthMethod[];

  /** Optional external identity attestation */
  proof?: AuthIdentityProof;

  /** Assurance score (invariant: >= 0, derived from policy) */
  score: number;

  /** When assurance was evaluated (invariant: valid timestamp) */
  evaluatedAt: number;

  /** Contextual information (invariant: immutable) */
  context: {
    /** Optional user agent string */
    userAgent?: string;

    /** Optional IP address */
    ipAddress?: string;

    /** Optional device identifier */
    deviceId?: string;

    /** Optional channel (invariant: one of "web", "mobile", "cli", "api") */
    channel?: "web" | "mobile" | "cli" | "api";
  };
}

/**
 * Authenticated session representation.
 *
 * Invariants:
 * - id is unique and immutable
 * - createdAt <= verifiedAt (if verifiedAt exists)
 * - expiresAt > createdAt (if expiresAt exists)
 * - assurance is non-null and valid
 * - transport is a valid AuthSessionTransport
 * - All timestamps are seconds since epoch
 */
export interface AuthSession<M extends Record<string, unknown> = {}> {
  /** Session identifier (invariant: unique, immutable) */
  id: SessionId;

  /** Session creation time (invariant: valid timestamp, immutable) */
  createdAt: number;

  /** Hard expiration (invariant: > createdAt if present, immutable) */
  expiresAt?: number;

  /** Last strong authentication time (invariant: >= createdAt if present) */
  verifiedAt: number;

  /** Authentication assurance snapshot (invariant: non-null, valid) */
  assurance: AuthAssurance;

  /** Session transport mechanism (invariant: valid transport type) */
  transport: AuthSessionTransport;

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
    fromSessionId: SessionId;

    /** When step-up was completed (invariant: valid timestamp) */
    at: number;
  };

  /** Authorization scopes (invariant: immutable array if present) */
  scopes?: string[];

  /** Adapter-level metadata (invariant: immutable) */
  meta?: M;
}
