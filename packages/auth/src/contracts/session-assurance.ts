import type { IdentityId } from "./identity.js";

/**
 * Numeric score representing session assurance strength.
 */
export type AuthSessionAssuranceScore = number;

/**
 * Authentication context information used to evaluate assurance.
 */
export interface AuthSessionAssuranceContext {
  /** Identity identifier */
  readonly identityId?: IdentityId;

  /** Identity provider identifier */
  readonly providerId?: string;

  /** Optional user agent string */
  readonly userAgent?: string;

  /** Optional IP address */
  readonly ipAddress?: string;

  /** Optional device identifier */
  readonly deviceId?: string;

  /** Optional channel ("web", "mobile", "cli", "api", ...) */
  readonly channel?: string;
}

/**
 * Persisted assurance state associated with a session.
 *
 * @remarks
 * This represents the assurance level already achieved and stored.
 * It MUST NOT be confused with runtime assurance evaluation,
 * which is performed by policies and evaluators.
 */
export interface AuthSessionAssurance<C extends Record<string, unknown> = {}> {
  /** Authentication methods used (invariant: non-empty array) */
  readonly methods: readonly string[];

  /** Optional external identity attestation */
  readonly proof?: string;

  /** Assurance score (invariant: >= 0, derived from policy) */
  readonly score: AuthSessionAssuranceScore;

  /** When assurance was evaluated (invariant: valid timestamp) */
  readonly evaluatedAt: number;

  /** Monotonic version used to track assurance upgrades */
  readonly version: number;

  /** Contextual information (invariant: immutable) */
  readonly context?: AuthSessionAssuranceContext & Readonly<C>;
}
