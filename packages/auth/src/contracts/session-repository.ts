import type { RepositoryError } from "@comity/primitives/errors";
import type { Result } from "@comity/primitives/result";
import type { AuthSessionId } from "../value-objects/auth-session-id.js";
import type { AuthSession } from "./session.js";

/**
 * Repository for authentication sessions.
 *
 * @remarks
 * This contract is the persistence boundary only. Domain operations such as
 * revocation live on `AuthSessionCommands`.
 */
export interface AuthSessionRepository {
  /**
   * Retrieve a session by its identifier.
   *
   * @returns The session, or `null` when no session exists for the given
   * identifier.
   */
  getById(id: AuthSessionId): Promise<Result<AuthSession | null, RepositoryError>>;

  /**
   * Persist a session.
   *
   * @remarks
   * Implementations MUST treat this as upsert: if the session id already
   * exists the stored session is overwritten, otherwise a new session is
   * created. This covers both `create` and `update` flows from the
   * previous contract without forcing callers to distinguish them.
   */
  save(session: AuthSession): Promise<Result<void, RepositoryError>>;
}
