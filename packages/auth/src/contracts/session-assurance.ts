/**
 * Session assurance level.
 *
 * Higher values represent stronger authentication.
 * The scale is application-defined.
 */
export type AuthSessionAssuranceScore = number;

/**
 * Authentication context information.
 */
export interface AuthSessionAssuranceContext {
  /** Identity identifier */
  identityId?: string;

  /** Identity provider identifier */
  providerId?: string;

  /** Optional user agent string */
  userAgent?: string;

  /** Optional IP address */
  ipAddress?: string;

  /** Optional device identifier */
  deviceId?: string;

  /** Optional channel ("web", "mobile", "cli", "api", ...) */
  channel?: string;
}

/**
 * Information about how and when a given assurance level was obtained.
 */
export interface AuthSessionAssurance {
  /** Authentication methods used (invariant: non-empty array) */
  methods: string[];

  /** Optional external identity attestation */
  proof?: string;

  /** Assurance score (invariant: >= 0, derived from policy) */
  score: AuthSessionAssuranceScore;

  /** When assurance was evaluated (invariant: valid timestamp) */
  evaluatedAt: number;

  /** Assurance version (invariant: non-negative integer) */
  version: number;

  /** Contextual information (invariant: immutable) */
  context?: AuthSessionAssuranceContext;
}
