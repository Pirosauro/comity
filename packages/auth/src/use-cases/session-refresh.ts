import type { AuthSession } from "../contracts/session.js";

/**
 * Refresh Session Use Case Input
 */
export interface RefreshSessionInput {
  /**
   * Session to refresh
   */
  session: AuthSession;

  /**
   * Current timestamp (ms)
   */
  now: number;
}

/**
 * Refresh Session Use Case
 *
 * Adapter/application layer is responsible for:
 * - persistence / token rotation
 * - revocation checks / refresh policy invocation
 * - producing the resulting AuthSession that satisfies invariants
 */
export interface RefreshSession {
  /**
   * Refresh a session, returning the new session representation.
   */
  execute(input: RefreshSessionInput): AuthSession;
}
