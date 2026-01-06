import type { AclOrchestrator } from "../../application/orchestrator.js";
import type { AccessDecision, AccessRequest } from "../../core/types.js";

import { mapAclErrorToHttp } from "./error-mapper.js";

/**
 * HTTP adapter for ACL orchestration.
 *
 * Translates Result-based ACL evaluation to exception-based HTTP semantics.
 *
 * Invariants:
 * - can() either returns AccessDecision or throws HttpError
 * - No business logic implemented (pure transport adaptation)
 * - Errors contain HTTP-compatible status codes and messages
 *
 * Misuse Prevention:
 * - Always catch exceptions from can() calls
 * - Do not use for non-HTTP contexts
 */
export function createHttpAclHandler<
  S extends Record<string, unknown>,
  R extends Record<string, unknown>,
  C extends Record<string, unknown>
>(orchestrator: AclOrchestrator<S, R, C>) {
  return {
    /**
     * Check whether access is allowed.
     *
     * @throws HttpError when access is denied or evaluation fails
     * @returns AccessDecision when access is granted
     */
    async can(request: AccessRequest<S, R, C>): Promise<AccessDecision> {
      const result = await orchestrator.can(request);

      if (!result.allowed) {
        throw mapAclErrorToHttp(result.reason, {
          ...(result.policy ? { policy: result.policy } : {}),
          request,
        });
      }

      return result;
    },
  };
}
