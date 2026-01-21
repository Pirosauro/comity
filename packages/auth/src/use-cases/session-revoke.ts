import type { AuthSessionRepository } from "../contracts/session-repository.js";
import type { AuthSessionId } from "../contracts/session.js";
import type { AuthSessionEmitter } from "../events/session.js";

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

  /** Event emitter for session lifecycle events */
  #emitter: AuthSessionEmitter;

  /**
   * @param repository - Session repository
   * @param emitter - Event emitter for lifecycle events
   */
  constructor(repository: AuthSessionRepository, emitter: AuthSessionEmitter) {
    this.#repository = repository;
    this.#emitter = emitter;
  }

  /**
   * Revokes a session.
   *
   * @param input - Revocation input
   * @param now - Current timestamp in milliseconds
   * @throws {Error} - If revocation fails
   */
  async execute(input: RevokeSessionInput, now: number): Promise<void> {
    // 1. Load session (throws if not found)
    const session = await this.#repository.get(input.id);

    // 2. Persist revocation
    await this.#repository.revoke(session.id, input.reason, now, input.actor);

    // 3. Emit lifecycle event
    this.#emitter.sessionRevoked({
      sessionId: session.id,
      reason: input.reason,
      revokedAt: now,
    });
  }
}
