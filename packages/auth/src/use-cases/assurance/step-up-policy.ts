import type { AuthSessionAssurancePolicy } from "../../contracts/session-assurance-policy.js";
import type { AuthSession } from "../../contracts/session.js";

import { AssuranceRequiredError } from "../../errors/assurance-required.js";

/**
 * Assurance policy that requires step-up authentication.
 */
export class StepUpRequiredPolicy implements AuthSessionAssurancePolicy {
  /** @inheritdoc */
  assert(session: AuthSession) {
    // Step-up required
    if (!session.stepUp || typeof session.stepUp !== "object") {
      throw new AssuranceRequiredError({ reason: "step_up_required", policy: "step-up" });
    }
  }
}
