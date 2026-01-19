import type { AuthSession } from "./session.js";

/**
 * Policy that evaluates whether a session meets an assurance requirement.
 */
export interface AuthSessionAssurancePolicy {
  /**
   * Assert session assurance
   *
   * @param session The authenticated session
   * @param now Current timestamp
   * @throws AssuranceRequiredError
   */
  assert(session: AuthSession, now: number): void;
}
