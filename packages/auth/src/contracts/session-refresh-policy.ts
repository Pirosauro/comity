import type { AuthSession } from "./session.js";

/**
 * Policy that determines whether a session can be refreshed.
 *
 * Pure domain contract:
 * - synchronous
 * - side-effect free
 * - throws on failure
 */
export interface AuthSessionRefreshPolicy {
  /**
   * Assert that the given session can be refreshed.
   *
   * @param session The authentication session to verify.
   * @param now Current timestamp
   * @throws SessionRefreshExpiredError
   * @throws SessionRefreshNotAllowedError
   */
  assert(session: AuthSession, now: number): void;
}
