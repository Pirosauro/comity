import type { AuthSessionRevocationPolicy } from "../../contracts/session-revocation-policy.js";
import type { AuthSession } from "../../contracts/session.js";

/**
 * Combines multiple revocation policies.
 * Any policy may revoke the session.
 */
export class CompositeRevocationPolicy implements AuthSessionRevocationPolicy {
  /** The list of revocation policies to combine */
  #policies: AuthSessionRevocationPolicy[];

  /**
   * @param policies Session revocation policies to combine
   */
  constructor(readonly policies: AuthSessionRevocationPolicy[]) {
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
