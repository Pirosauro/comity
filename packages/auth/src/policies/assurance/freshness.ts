import type { AuthSessionAssurancePolicy } from "../../contracts/session-assurance-policy.js";
import type { AuthSession } from "../../contracts/session.js";

import { AuthError } from "../../error/auth.js";

/**
 * Assurance policy that enforces a maximum age requirement.
 */
export class FreshnessAssurancePolicy implements AuthSessionAssurancePolicy {
  /** Maximum allowed age in milliseconds */
  #age: number;

  /**
   * @param age - Maximum allowed age in milliseconds
   */
  constructor(age: number) {
    this.#age = age;
  }

  /** @inheritdoc */
  assert(session: AuthSession, now: number): void {
    const age = now - session.assurance.evaluatedAt;

    // Expired assurance
    if (age > this.#age) {
      throw new AuthError("assurance_expired", {
        details: {
          policy: "freshness",
        },
        context: {
          currentAge: age,
          maxAge: this.#age,
        },
      });
    }
  }
}
