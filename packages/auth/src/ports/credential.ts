/**
 * AuthCredential Interface
 *
 * Represents an authentication credential extracted from a request context.
 *
 * Invariants:
 * - kind is a non-empty string identifying credential type
 * - value is a non-empty string containing credential data
 * - Both properties are readonly (immutable)
 *
 * Misuse Prevention:
 * - Validate kind against known types before processing
 * - Do not log or expose value in plain text
 * - Treat as sensitive data (encryption at rest/transit)
 */
export interface AuthCredential {
  /** Credential type identifier (invariant: non-empty, case-sensitive) */
  readonly kind: string;

  /** Credential value (invariant: non-empty, treat as sensitive) */
  readonly value: string;
}
