import type { AuthSessionRefreshPolicy } from "../../contracts/session-refresh-policy.js";
import type { AuthSession } from "../../contracts/session.js";

/**
 * Combines multiple refresh policies.
 *
 * Fails fast on first violation.
 */
export class CompositeRefreshPolicy implements AuthSessionRefreshPolicy {
  constructor(private readonly policies: AuthSessionRefreshPolicy[]) {}

  /**
   * @inheritdoc
   */
  assert(session: AuthSession, now: number): void {
    for (const policy of this.policies) {
      policy.assert(session, now);
    }
  }
}
