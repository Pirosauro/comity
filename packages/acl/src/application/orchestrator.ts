import type { AccessDecision, AccessRequest } from "../core/types.js";
import type { PolicyProvider } from "../ports/policy-provider.js";

/**
 * ACL Orchestrator
 *
 * Coordinates access control evaluation through policy providers.
 *
 * Invariants:
 * - can() returns a valid AccessDecision
 * - Same request always produces same decision (idempotent)
 * - No side effects during evaluation
 *
 * Misuse Prevention:
 * - Do not modify the provider after construction
 * - Handle both synchronous and asynchronous results
 */
export class AclOrchestrator<
  S extends Record<string, unknown> = Record<string, unknown>,
  R extends Record<string, unknown> = Record<string, unknown>,
  C extends Record<string, unknown> = Record<string, unknown>
> {
  /**
   * Create orchestrator with a policy provider.
   *
   * Invariants:
   * - provider is required and immutable after construction
   * - provider must be thread-safe for concurrent use
   */
  constructor(private readonly provider: PolicyProvider<S, R, C>) {}

  /**
   * Evaluate access request against policies.
   *
   * Invariants:
   * - Returns Allow or Deny decision
   * - Decision based solely on request content
   * - No external state mutations
   */
  async can(request: AccessRequest<S, R, C>): Promise<AccessDecision> {
    return this.provider.can(request);
  }
}
