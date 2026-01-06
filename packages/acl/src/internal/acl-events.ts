import type { AccessRequest } from "../core/types.js";
import type { AccessControlProvider } from "../ports/access-control-provider.js";
import type { AclModuleEvents } from "../setup/types.js";

/**
 * Wraps an AccessControlProvider to emit events after decisions.
 *
 * Invariants:
 * - Events are emitted after the decision is made (observational, not controlling)
 * - Event emission failures do not affect the access decision
 * - Timestamps are in seconds since epoch
 *
 * Misuse Prevention:
 * - Do not depend on events for business logic (they may be disabled)
 * - Event payloads are read-only (do not modify request objects)
 */
export function withAclEvents<
  S extends Record<string, unknown> = Record<string, unknown>,
  R extends Record<string, unknown> = Record<string, unknown>,
  C extends Record<string, unknown> = Record<string, unknown>
>(
  provider: AccessControlProvider<S, R, C>,
  emit: <T>(name: string, payload?: T) => Promise<void>
): AccessControlProvider {
  const can = provider.can.bind(provider);

  return {
    can: async (request: AccessRequest) => {
      const now = Math.floor(Date.now() / 1000);
      const result = await can(request);

      if (result.allowed) {
        await emit<AclModuleEvents["@comity/acl:access-allowed"]>(
          "@comity/acl:access-allowed",
          { request, timestamp: now }
        );
      } else {
        await emit<AclModuleEvents["@comity/acl:access-denied"]>(
          "@comity/acl:access-denied",
          {
            request,
            reason: result.reason,
            ...(result.policy ? { policy: result.policy } : {}),
            timestamp: now,
          }
        );
      }

      return result;
    },
  } as AccessControlProvider;
}
