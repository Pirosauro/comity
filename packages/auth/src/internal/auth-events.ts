import type { AuthOrchestrator } from "../application/orchestrator.js";
import type { AuthModuleEvents } from "../setup/types.js";

export function withAuthEvents<
  R,
  I extends Record<string, unknown>,
  S extends Record<string, unknown>,
  E extends string
>(
  orchestrator: AuthOrchestrator<R, I, S, E>,
  emit: <T>(name: string, payload?: T) => Promise<void>
): AuthOrchestrator<R, I, S, E> {
  const authorize = orchestrator.authorize.bind(orchestrator);
  const refresh = orchestrator.refresh.bind(orchestrator);

  return {
    authorize: async (...args: Parameters<typeof authorize>) => {
      const now = Math.floor(Date.now() / 1000);
      const result = await authorize(...args);

      if (result.ok) {
        await emit<AuthModuleEvents["@comity/auth:authorized"]>(
          "@comity/auth:authorized",
          { context: result.value.context, timestamp: now }
        );
      } else {
        await emit<AuthModuleEvents["@comity/auth:authorization-failed"]>(
          "@comity/auth:authorization-failed",
          { reason: result.reason, timestamp: now }
        );
      }

      return result;
    },

    refresh: async (...args: Parameters<typeof refresh>) => {
      const now = Math.floor(Date.now() / 1000);
      const result = await refresh(...args);

      if (result.ok) {
        await emit<AuthModuleEvents["@comity/auth:refreshed"]>(
          "@comity/auth:refreshed",
          { context: result.value.context, timestamp: now }
        );
      } else {
        await emit<AuthModuleEvents["@comity/auth:refresh-failed"]>(
          "@comity/auth:refresh-failed",
          { reason: result.reason, timestamp: now }
        );
      }

      return result;
    },
  } as AuthOrchestrator<R, I, S, E>;
}
