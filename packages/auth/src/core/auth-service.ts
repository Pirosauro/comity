import type { AuthSession, Result } from "./types.js";
import type { AuthSessionInvariantReason } from "./invariants.js";
import type { AuthSessionValidationReason } from "./validation.js";
import type {
  RefreshRequirement,
  RefreshAllowed,
  RefreshDenied,
} from "./refresh.js";
import type {
  AuthStepUpNotRequired,
  AuthStepUpRequired,
  AuthStepUpRequirement,
} from "./step-up.js";

import { checkSessionInvariants } from "./invariants.js";
import { validateSession } from "./validation.js";
import { evaluateRefresh } from "./refresh.js";
import { evaluateStepUp } from "./step-up.js";

export interface AuthService {
  authorize(
    session: AuthSession,
    requirement?: AuthStepUpRequirement,
    now?: number
  ): Result<
    {
      /** Whether the action is allowed without additional step-up */
      allowed: boolean;

      /** Step-up evaluation result */
      stepUp?: AuthStepUpNotRequired | AuthStepUpRequired | undefined;
    },
    AuthSessionInvariantReason | AuthSessionValidationReason
  >;

  refresh(
    session: AuthSession,
    requirement?: RefreshRequirement,
    now?: number
  ): Result<
    {
      /** Whether the action is allowed without additional refresh */
      allowed: boolean;

      /** Refresh evaluation result */
      refresh?: RefreshAllowed | RefreshDenied | undefined;
    },
    AuthSessionInvariantReason | AuthSessionValidationReason
  >;
}

export function createAuthService(): AuthService {
  return {
    authorize(session, requirement = {}, now = Math.floor(Date.now() / 1000)) {
      // 1. Invariants (structural correctness)
      const invariants = checkSessionInvariants(session);

      if (!invariants.ok) {
        return invariants;
      }

      // 2. Validation (expiration, assurance snapshot)
      const validation = validateSession(session, { now });

      if (!validation.ok) {
        return validation;
      }

      // 3. Step-up evaluation (policy-driven)
      const stepUp = evaluateStepUp(session, requirement, now);

      if (!stepUp.ok) {
        return stepUp;
      }

      // 4. Decision
      return {
        ok: true,
        value: stepUp.value?.required
          ? { allowed: false, stepUp: stepUp.value }
          : { allowed: true },
      };
    },

    refresh(session, requirement = {}, now = Math.floor(Date.now() / 1000)) {
      // 1. Invariants
      const invariants = checkSessionInvariants(session);

      if (!invariants.ok) return invariants;

      // 2. Validation
      const validation = validateSession(session, { now });

      if (!validation.ok) return validation;

      // 3. Refresh evaluation
      const refresh = evaluateRefresh(session, requirement, now);

      if (!refresh.ok) {
        return refresh;
      }

      // 4. Decision
      return {
        ok: true,
        value: refresh.value?.allowed
          ? {
              allowed: true,
              refresh: refresh.value,
            }
          : {
              allowed: false,
              refresh: refresh.value,
            },
      };
    },
  };
}
