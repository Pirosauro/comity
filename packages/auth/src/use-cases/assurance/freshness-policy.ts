import type { AuthSessionAssurancePolicy } from "../../contracts/session-assurance-policy.js";
import type { AuthSession } from "../../contracts/session.js";

import { AssuranceRequiredError } from "../../errors/assurance-required.js";

/**
 * Freshness assurance policy.
 */
export class FreshnessAssurancePolicy implements AuthSessionAssurancePolicy {
  /** Maximum allowed age in milliseconds */
  #age: number;

  /**
   * @param age The maximum allowed age in milliseconds
   */
  constructor(age: number) {
    this.#age = age;
  }

  /**
   * @inheritdoc
   */
  assert(session: AuthSession, now: number) {
    const age = now - session.assurance.evaluatedAt;

    // Expired assurance
    if (age > this.#age) {
      throw new AssuranceRequiredError({
        reason: "assurance_expired",
        policy: "freshness",
        currentAge: age,
        maxAge: this.#age,
      });
    }
  }
}
