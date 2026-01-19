import type { AuthSession } from "../contracts/session.js";

/**
 * Revoke Session Use Case Input
 */
export interface RevokeSessionInput {
  /**
   * Session to revoke
   */
  session: AuthSession;

  /**
   * Reason for revocation
   */
  reason: string;

  /**
   * Current timestamp (ms)
   */
  now: number;
}

/**
 * Revoke Session Use Case
 *
 * Adapter/application layer is responsible for:
 * - persistence / revocation list management
 * - token invalidation / cleanup
 * - emitting sessionRevoked events
 */
export interface RevokeSession {
  /**
   * Revoke a session.
   */
  execute(input: RevokeSessionInput): void;
}
