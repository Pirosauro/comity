import type { AccessRequest, AccessDecision } from "../core/types.js";

/**
 * Access Control Provider Port
 *
 * Defines the capability to evaluate access requests against policies.
 *
 * Invariants:
 * - can() must be idempotent (same input always yields same output)
 * - Implementations must handle concurrent calls safely
 * - Errors should be propagated as rejections, not swallowed
 *
 * Misuse Prevention:
 * - Do not call can() with undefined/null values in request fields
 * - Expect AccessDecision.allowed to be boolean (not truthy/falsy)
 */
export interface AccessControlProvider<
  S extends Record<string, unknown> = Record<string, unknown>,
  R extends Record<string, unknown> = Record<string, unknown>,
  C extends Record<string, unknown> = Record<string, unknown>
> {
  can(request: AccessRequest): Promise<AccessDecision>;
}
