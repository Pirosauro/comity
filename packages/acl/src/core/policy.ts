import type { AccessDecision, AccessRequest } from "./types.js";

/**
 * Access Policy Interface
 *
 * Defines the contract for evaluating access requests.
 *
 * Invariants:
 * - evaluate() returns a valid AccessDecision (Allow or Deny)
 * - Same request always produces same decision (idempotent)
 * - No side effects during evaluation
 *
 * Misuse Prevention:
 * - Do not modify the input request object
 * - Handle both synchronous and asynchronous evaluation
 */
export interface AccessPolicy {
  /** Unique identifier for the policy (invariant: non-empty, case-sensitive) */
  readonly id: string;

  /**
   * Evaluate an access request.
   *
   * Invariants:
   * - Returns Allow or Deny decision
   * - Decision is based solely on request content
   * - No external state mutations
   */
  evaluate(request: AccessRequest): AccessDecision | Promise<AccessDecision>;
}
