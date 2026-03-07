import type { AuthSessionRepository } from "../contracts/session-repository.js";
import type { AuthSessionId } from "../contracts/session.js";
import type { AuthSessionObserver } from "../hooks/session.js";

/**
 * Input used to revoke a session.
 */
export interface RevokeSessionInput {
  /** Session identifier */
  readonly id: AuthSessionId;

  /** Revocation reason (audit / security) */
  readonly reason: string;

  /** Optional actor (admin, system, user, ...) */
  readonly actor?: {
    /** Actor type */
    readonly type: string;

    /** Actor identifier */
    readonly id?: string;
  };
}

/**
 * Use case that revokes an authenticated session.
 */
export class RevokeSession {
  /** Repository for session persistence */
  #repository: AuthSessionRepository;

  /** Event observer for session lifecycle events */
  #observer: AuthSessionObserver;

  /**
   * @param repository - Session repository
   * @param observer - Event observer for lifecycle events
   */
  constructor(repository: AuthSessionRepository, observer: AuthSessionObserver) {
    this.#repository = repository;
    this.#observer = observer;
  }

  /**
   * Revokes a session.
   *
   * @param input - Revocation input
   * @param now - Current timestamp in milliseconds
   */
  async execute(input: RevokeSessionInput, now: number): Promise<void> {
    try {
      // 1. Load session (throws if not found)
      const session = await this.#repository.get(input.id);

      // 2. Persist revocation
      await this.#repository.revoke(session.id, input.reason, now, input.actor);

      // 3. Emit lifecycle event
      this.#observer.onSessionRevoked({
        sessionId: session.id,
        reason: input.reason,
        revokedAt: now,
      });
    } catch (error) {
      // Revokation is a best-effort operation: log error but do not throw
    }
  }
}
