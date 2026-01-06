import type { PolicyProvider } from "../ports/policy-provider.js";
import type { AccessDecision, AccessRequest } from "../core/types.js";

import { ACL_ACCESS_DENY_REASONS } from "../core/constants.js";

/**
 * Composes multiple policy providers into a single provider.
 *
 * Invariants:
 * - Policies are evaluated in the order provided
 * - First allow decision wins (short-circuit evaluation)
 * - If no policy allows, returns the last deny reason
 * - If no policies exist, returns POLICY_NOT_FOUND
 *
 * Misuse Prevention:
 * - Do not rely on policy evaluation order for security (reorder policies to change behavior)
 * - Expect providers array to be non-empty (will fallback to POLICY_NOT_FOUND)
 */
export function composePolicies(
  providers: readonly PolicyProvider[]
): PolicyProvider {
  return {
    async can(request: AccessRequest): Promise<AccessDecision> {
      let deny: AccessDecision | null = null;

      for (const provider of providers) {
        const decision = await provider.can(request);

        // First-allow wins (intent: permissive composition)
        if (decision.allowed) return decision;

        // Accumulate last deny reason (for fallback)
        deny = decision;
      }

      return (
        deny ?? {
          allowed: false,
          reason: ACL_ACCESS_DENY_REASONS.POLICY_NOT_FOUND, // fallback reason
        }
      );
    },
  };
}
