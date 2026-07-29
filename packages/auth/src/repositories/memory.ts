import type { AuthSession, AuthSessionId } from "../contracts/session";
import type { AuthSessionRepository } from "../contracts/session-repository";

import { AuthError } from "../errors";

/**
 * In-memory implementation of `AuthSessionRepository` for testing and development purposes.
 *
 * Note: This implementation is not suitable for production use as it does not persist sessions
 * and is not shared across multiple instances of the application.
 */
export class MemoryAuthSessionRepository implements AuthSessionRepository {
  #sessions = new Map<AuthSessionId, AuthSession>();

  /**
   * @inheritdoc
   */
  async get(id: AuthSessionId): Promise<AuthSession> {
    const session = this.#sessions.get(id);

    if (!session) {
      throw new AuthError("session_not_found", {
        details: {
          subject: id,
          retriable: false,
        },
        context: {
          adapter: "memory",
        },
      });
    }

    return session;
  }

  /**
   * @inheritdoc
   */
  async create(session: AuthSession): Promise<void> {
    // Idempotency is guaranteed by the Map's set method, which overwrites if the key exists
    this.#sessions.set(session.id, { ...session });
  }

  /**
   * @inheritdoc
   */
  async update(session: AuthSession): Promise<void> {
    if (!this.#sessions.has(session.id)) {
      throw new AuthError("session_not_found", {
        details: {
          subject: session.id,
          retriable: false,
        },
        context: {
          adapter: "memory",
        },
      });
    }

    this.#sessions.set(session.id, { ...session });
  }

  /**
   * @inheritdoc
   */
  async revoke(
    id: AuthSessionId,
    reason: string,
    at: number,
    actor?: {
      /** Type of actor triggering revocation */
      type: string;

      /** Identifier of the actor */
      id?: string;
    }
  ): Promise<void> {
    // Revocation is always a best-effort operation
    if (this.#sessions.has(id)) {
      this.#sessions.delete(id);
    }
  }

  /**
   * Utility method to clear all sessions from the repository.
   */
  async clear(): Promise<void> {
    this.#sessions.clear();
  }
}
