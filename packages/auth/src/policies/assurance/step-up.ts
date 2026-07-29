import type { AuthSessionAssurancePolicy } from "../../contracts/session-assurance-policy.js";
import type { AuthSession } from "../../contracts/session.js";

import { AuthError } from "../../errors/auth.js";

/**
 * Assurance policy that requires step-up authentication.
 */
export class StepUpRequiredPolicy implements AuthSessionAssurancePolicy {
  /** @inheritdoc */
  assert(session: AuthSession): void {
    // Step-up required
    if (!session.stepUp || typeof session.stepUp !== "object") {
      throw new AuthError("assurance_step_up_required", { details: { policy: "step_up" } });
    }
  }
}
