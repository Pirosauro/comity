import type { AuthSessionAssurancePolicy } from "../../contracts/session-assurance-policy.js";
import type { AuthSession } from "../../contracts/session.js";

/**
 * Combines multiple assurance policies.
 * All policies must be satisfied.
 */
export class CompositeAssurancePolicy implements AuthSessionAssurancePolicy {
  /** The list of assurance policies to combine */
  #policies: AuthSessionAssurancePolicy[];

  /**
   * @param policies Session assurance policies to combine
   */
  constructor(policies: AuthSessionAssurancePolicy[]) {
    this.#policies = policies;
  }

  /**
   * @inheritdoc
   */
  assert(session: AuthSession, now: number) {
    // Evaluate each policy in sequence
    for (const policy of this.#policies) {
      policy.assert(session, now);
    }
  }
}
