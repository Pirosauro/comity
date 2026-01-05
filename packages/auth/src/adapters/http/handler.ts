import type { AuthOrchestrator } from "../../application/orchestrator.js";

import { mapAuthErrorToHttp } from "./map-auth-error.js";

export function createHttpAuthHandler<
  R,
  I extends Record<string, unknown>,
  S extends Record<string, unknown>,
  E extends string
>(orchestrator: AuthOrchestrator<R, I, S, E>) {
  return {
    async authorize(req: R) {
      const result = await orchestrator.authorize(req);

      if (!result.ok) {
        throw mapAuthErrorToHttp(result.reason);
      }

      return result.value;
    },

    async refresh(req: R) {
      const result = await orchestrator.refresh(req);

      if (!result.ok) {
        throw mapAuthErrorToHttp(result.reason);
      }

      return result.value;
    },
  };
}
