import type { AuthSession } from "./session.js";

/**
 * Policy that evaluates whether a session meets an assurance requirement.
 */
export interface AuthSessionAssurancePolicy {
  /**
   * Assert that the session satisfies the assurance policy.
   *
   * @param session - The authenticated session
   * @param now - Current timestamp in milliseconds
   * @throws {AssuranceRequiredError} - When the session does not meet the policy
   */
  assert(session: AuthSession, now: number): void;
}
