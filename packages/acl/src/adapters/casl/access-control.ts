import type { AccessControlProvider } from "../../ports/access-control-provider.js";
import type { AccessDecision, AccessRequest } from "../../core/types.js";
import type { CaslAdapterOptions } from "./types.js";

import { mapResourceToCasl } from "./resource-mapper.js";
import { ACL_ACCESS_DENY_REASONS } from "../../core/constants.js";

/**
 * Create CASL-based access control provider.
 *
 * @param options - CASL adapter configuration
 * @returns AccessControlProvider implementation using CASL
 *
 * @remarks
 * Integrates CASL's ability-based permissions with Comity's ACL system.
 * Supports field-level permissions through resource.attributes.field.
 *
 * Invariants:
 * - Returns valid AccessDecision for all requests
 * - Uses CASL ability evaluation semantics
 * - Field-level permissions supported via resource.attributes.field
 *
 * Misuse Prevention:
 * - Do not pass undefined subjects to defineAbility
 * - Handle both allow and deny cases in error responses
 */
export function createCaslAccessControl(
  options: CaslAdapterOptions
): AccessControlProvider {
  return {
    /**
     * Evaluate access request using CASL abilities.
     *
     * @param request - Access request to evaluate
     * @returns Promise resolving to access decision
     * @remarks
     * Creates subject-specific ability instance and evaluates permissions.
     * Supports field-level checks when resource.attributes.field is present.
     */
    async can(
      request: AccessRequest<
        Record<string, unknown>,
        { field?: string },
        Record<string, unknown>
      >
    ): Promise<AccessDecision> {
      const ability = options.defineAbility(request.subject);
      const resource = mapResourceToCasl(request.resource);

      // Evaluate permission (invariant: boolean result)
      const allowed = ability.can(
        request.action,
        resource,
        request.resource.attributes?.field
      );

      if (!allowed) {
        return {
          allowed: false,
          reason: ACL_ACCESS_DENY_REASONS.FORBIDDEN,
          ...(options.resolvePolicyName
            ? {
                policy: options.resolvePolicyName({
                  action: request.action,
                  resource: request.resource.type,
                }),
              }
            : {}),
          meta: {
            adapter: "casl",
          },
        };
      }

      return {
        allowed: true,
        policy:
          options.resolvePolicyName?.({
            action: request.action,
            resource: request.resource.type,
          }) || "unknown",
        meta: {
          adapter: "casl",
        },
      };
    },
  };
}
