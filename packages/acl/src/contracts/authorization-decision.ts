/**
 * Result of an authorization evaluation.
 *
 * `allowed` indicates whether the requested action is permitted.
 * `reason` provides optional human-readable information about the decision,
 * particularly useful for denials.
 */
export interface AuthorizationDecision {
  /** Whether the requested action is permitted. */
  readonly allowed: boolean;

  /** Optional human-readable reason for the decision. */
  readonly reason?: string;
}