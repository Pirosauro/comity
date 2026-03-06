import type { AuthSession, AuthSessionId } from "./session.js";

/**
 * Repository for authentication sessions.
 */
export interface AuthSessionRepository {
  /**
   * Find a session by id.
   *
   * @returns the session
   *
   * @throws {Error} - Infrastructure error (e.g., database connection failure)
   */
  get(id: AuthSessionId): Promise<AuthSession>;

  /**
   * Persist a new session.
   *
   * Must be idempotent.
   *
   * @throws {Error} - Infrastructure error (e.g., database connection failure)
   */
  create(session: AuthSession): Promise<void>;

  /**
   * Update an existing session.
   *
   * @throws {Error} - Infrastructure error (e.g., database connection failure)
   */
  update(session: AuthSession): Promise<void>;

  /**
   * Revoke a session.
   *
   * @param id - Session identifier to revoke
   * @param reason - Domain-specific reason for revocation (e.g., "user-requested", "security-incident")
   * @param at - Timestamp when revocation occurred
   * @param actor - Optional information about who triggered the revocation
   * @param actor.type - Type of actor (e.g., "system", "user", "admin")
   * @param actor.id - Identifier of the actor if applicable
   *
   * @throws {Error} - Infrastructure error (e.g., database connection failure)
   */
  revoke(
    id: AuthSessionId,
    reason: string,
    at: number,
    actor?: {
      /** Type of actor triggering revocation */
      type: string;

      /** Identifier of the actor */
      id?: string;
    }
  ): Promise<void>;
}
