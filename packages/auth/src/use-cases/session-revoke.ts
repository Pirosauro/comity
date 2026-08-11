import type { AuthSessionRepository } from "../contracts/session-repository.js";
import type { AuthSessionId } from "../value-objects/auth-session-id.js";
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
 *
 * @remarks
 * Revocation is intentionally a best-effort operation: if the underlying
 * repository fails, this use case swallows the error and lets the caller
 * decide whether to retry. The repository contract itself returns a
 * `Result`, so callers that want stricter semantics can call
 * `AuthSessionRepository.revoke()` directly.
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
    // 1. Persist revocation
    const result = await this.#repository.revoke({
      id: input.id,
      reason: input.reason,
      at: now,
      ...(input.actor ? { actor: input.actor } : {}),
    });

    // 2. Best-effort: ignore repository errors and continue with event emission
    if (!result.success) {
      return;
    }

    // 3. Emit lifecycle event
    this.#observer.onSessionRevoked({
      sessionId: input.id,
      reason: input.reason,
      revokedAt: now,
    });
  }
}
