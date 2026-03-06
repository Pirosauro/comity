import type { AuthSessionAssurancePolicy } from "../../contracts/session-assurance-policy.js";
import type { AuthSession } from "../../contracts/session.js";

/**
 * Combines multiple assurance policies with AND logic.
 *
 * All policies must be satisfied for the assertion to pass.
 */
export class CompositeAssurancePolicy implements AuthSessionAssurancePolicy {
  /** Collection of assurance policies to combine */
  #policies: AuthSessionAssurancePolicy[];

  /**
   * @param policies - Session assurance policies to combine
   */
  constructor(policies: AuthSessionAssurancePolicy[]) {
    this.#policies = policies;
  }

  /** @inheritdoc */
  assert(session: AuthSession, now: number): void {
    // Evaluate each policy in sequence
    for (const policy of this.#policies) {
      policy.assert(session, now);
    }
  }
}
