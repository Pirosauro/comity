import type { AuthSession } from "./session.js";

/**
 * Policy that determines whether a session is revoked.
 */
export interface AuthSessionRevocationPolicy {
  /**
   * Evaluate the revocation status of a session.
   *
   * @param session - The authentication session to evaluate
   * @param now - Current timestamp in milliseconds
   * @throws {SessionRevokedError} - If the session is considered revoked
   */
  assert(session: AuthSession, now: number): void;
}
