import type { AuthSessionAssurancePolicy } from "../../contracts/session-assurance-policy.js";
import type { AuthSession } from "../../contracts/session.js";

import { AssuranceRequiredError } from "../../errors/assurance-required.js";

/**
 * Assurance policy that enforces a minimum score requirement.
 */
export class ScoreAssurancePolicy implements AuthSessionAssurancePolicy {
  /** Minimum required assurance score */
  #score: number;

  /**
   * @param score - Minimum required score
   */
  constructor(score: number) {
    this.#score = score;
  }

  /** @inheritdoc */
  assert(session: AuthSession) {
    const assurance = session.assurance;

    // Insufficient level
    if (assurance.score < this.#score) {
      throw new AssuranceRequiredError({
        reason: "insufficient",
        policy: "score",
        currentScore: assurance.score,
        requiredScore: this.#score,
      });
    }
  }
}
