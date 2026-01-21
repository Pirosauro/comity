import type { AuthSession, AuthSessionId } from "./session.js";

/**
 * Repository for authentication sessions.
 */
export interface AuthSessionRepository {
  /**
   * Find a session by id.
   *
   * @returns the session
   * @throws InvalidSessionError if the session id is malformed or not found
   */
  get(id: AuthSessionId): Promise<AuthSession>;

  /**
   * Persist a new session.
   *
   * Must be idempotent.
   */
  create(session: AuthSession): Promise<void>;

  /**
   * Update an existing session.
   */
  update(session: AuthSession): Promise<void>;

  /**
   * Revoke a session.
   *
   * @param reason domain-specific reason
   */
  revoke(
    id: AuthSessionId,
    reason: string,
    at: number,
    actor?: {
      /**
       *
       */
      type: string; /**
       *
       */
      id?: string;
    }
  ): Promise<void>;
}
