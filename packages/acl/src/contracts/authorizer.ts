import type { Result } from "@comity/primitives/result";
import type { AuthorizationError } from "../errors/authorization.js";
import type { AuthorizationContext } from "./authorization-context.js";
import type { AuthorizationDecision } from "./authorization-decision.js";

/**
 * Core authorization capability.
 *
 * An authorizer evaluates whether a subject may perform an action on a resource
 * within a given context. It is a pure capability: it has no internal state,
 * no policy, and no external dependencies. The policy is provided by the
 * Application Layer when composing the authorizer implementation.
 *
 * @remarks
 * The interface is asynchronous to accommodate both synchronous and
 * asynchronous policy engines. The Core contract itself performs no I/O.
 */
export interface Authorizer {
  /**
   * Evaluates an authorization request.
   *
   * @param context - The authorization context containing subject, action,
   *   resource, and optional context.
   *
   * @returns A Result containing the AuthorizationDecision on success,
   *   or an AuthorizationError on infrastructure failure.
   *
   * A normal authorization denial is represented as a successful Result
   * with `allowed === false`. Only infrastructure or provider failures
   * yield an AuthorizationError.
   */
  authorize(
    context: AuthorizationContext
  ): Promise<Result<AuthorizationDecision, AuthorizationError>>;
}
