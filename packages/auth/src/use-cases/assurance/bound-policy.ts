import type { AuthSessionAssurancePolicy } from "../../contracts/session-assurance-policy.js";
import type { AuthSessionAssuranceContext } from "../../contracts/session-assurance.js";
import type { AuthSession } from "../../contracts/session.js";

import { AssuranceRequiredError } from "../../errors/assurance-required.js";

/**
 * Options for context-bound assurance policy
 */
export interface ContextBoundOptions extends AuthSessionAssuranceContext {}

/**
 * Bound assurance policy.
 */
export class BoundAssurancePolicy implements AuthSessionAssurancePolicy {
  /** Minimum required assurance score */
  #bounds: AuthSessionAssurancePolicy;

  /**
   * @param bounds The required bounds
   */
  constructor(bounds: AuthSessionAssurancePolicy) {
    this.#bounds = bounds;
  }

  /**
   * @inheritdoc
   */
  assert(session: AuthSession) {
    const context = session.assurance.context || {};

    // Check each bound
    Object.entries(this.#bounds).forEach(([key, value]) => {
      if (context[key as keyof typeof context] !== value) {
        throw new AssuranceRequiredError({
          reason: "out_of_bounds",
          policy: "bound",
          expected: { [key]: value },
          actual: { [key]: context[key as keyof typeof context] },
        });
      }
    });
  }
}
