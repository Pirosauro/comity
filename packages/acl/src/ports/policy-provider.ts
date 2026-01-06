import type { AccessRequest, AccessDecision } from "../core/types.js";

/**
 * Policy Provider Port
 *
 * Defines the capability to evaluate a single access policy.
 *
 * Invariants:
 * - can() results are independent of call order
 * - Implementations should be stateless (no side effects)
 * - Return values must conform to AccessDecision union type
 *
 * Misuse Prevention:
 * - Policies should not modify the input request object
 * - Expect synchronous or asynchronous evaluation (handle both)
 */
export interface PolicyProvider<
  S extends Record<string, unknown> = Record<string, unknown>,
  R extends Record<string, unknown> = Record<string, unknown>,
  C extends Record<string, unknown> = Record<string, unknown>
> {
  can(request: AccessRequest): AccessDecision | Promise<AccessDecision>;
}
