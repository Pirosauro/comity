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
  /** Context bounds that must match the session assurance context */
  #bounds: ContextBoundOptions;

  /**
   * @param bounds The required bounds
   */
  constructor(bounds: ContextBoundOptions) {
    this.#bounds = bounds;
  }

  /**
   * @inheritdoc
   */
  assert(session: AuthSession, now: number): void {
    const context = session.assurance.context || {};

    for (const [key, expected] of Object.entries(this.#bounds)) {
      if (expected === undefined) {
        continue;
      }

      const actual = context[key as keyof typeof context];

      if (actual !== expected) {
        throw new AssuranceRequiredError({
          reason: "out_of_bounds",
          policy: "bound",
          expected: { [key]: expected },
          actual: { [key]: actual },
        });
      }
    }
  }
}
