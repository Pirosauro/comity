import type { AuthSessionAssurancePolicy } from "../../contracts/session-assurance-policy.js";
import type { AuthSessionAssuranceContext } from "../../contracts/session-assurance.js";
import type { AuthSession } from "../../contracts/session.js";

import { AuthError } from "../../error/auth.js";

/**
 * Assurance policy that enforces context bounds.
 *
 * Validates that session assurance context matches required bounds.
 */
export class BoundAssurancePolicy implements AuthSessionAssurancePolicy {
  /** Context bounds that must match the session assurance context */
  #bounds: AuthSessionAssuranceContext;

  /**
   * @param bounds - Required bounds
   */
  constructor(bounds: AuthSessionAssuranceContext) {
    this.#bounds = bounds;
  }

  /** @inheritdoc */
  assert(session: AuthSession): void {
    const context = session.assurance.context || {};

    for (const [key, expected] of Object.entries(this.#bounds)) {
      if (expected === undefined) {
        continue;
      }

      const actual = context[key as keyof typeof context];

      if (actual !== expected) {
        throw new AuthError("assurance_invalid", {
          details: {
            policy: "bound",
          },
          context: {
            expected: { [key]: expected },
            actual: { [key]: actual },
          },
        });
      }
    }
  }
}
