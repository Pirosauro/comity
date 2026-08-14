import type { RepositoryError } from "@comity/primitives/errors";
import type { Result } from "@comity/primitives/result";
import type { AuthSessionRepository } from "../contracts/session-repository.js";
import type { AuthSession } from "../contracts/session.js";
import type { AuthSessionId } from "../value-objects/auth-session-id.js";

import { success } from "@comity/primitives/result";

/**
 * In-memory implementation of `AuthSessionRepository` for testing and development purposes.
 *
 * Note: This implementation is not suitable for production use as it does not persist sessions
 * and is not shared across multiple instances of the application.
 */
export class MemoryAuthSessionRepository implements AuthSessionRepository {
  /** */
  #sessions = new Map<string, AuthSession>();

  /**
   * @inheritdoc
   */
  async getById(id: AuthSessionId): Promise<Result<AuthSession | null, RepositoryError>> {
    const session = this.#sessions.get(id.toString());

    if (!session) {
      return success(null);
    }

    return success(session);
  }

  /**
   * @inheritdoc
   */
  async save(session: AuthSession): Promise<Result<void, RepositoryError>> {
    this.#sessions.set(session.id.toString(), { ...session });

    return success(undefined);
  }

  /**
   * Utility method to clear all sessions from the repository.
   */
  async clear(): Promise<void> {
    this.#sessions.clear();
  }
}
