import type { AuthSessionRepository } from "../contracts/session-repository.js";
import type { AuthSession, AuthSessionId } from "../contracts/session.js";
import type { AuthSessionEmitter } from "../events/session.js";
import type { AuthGuard } from "../services/guard.js";

import { AUTH_SESSION_INVARIANT_REASONS } from "../contracts/session-invariants.js";
import { InvalidSessionError } from "../errors/invalid-session.js";

/**
 * Input used to refresh an authenticated session.
 */
export interface RefreshSessionInput {
  /** New session identifier */
  readonly id: AuthSessionId;

  /** Parent session identifier */
  readonly originalId: AuthSessionId;

  /** New expiration timestamp */
  readonly expiresAt?: number;
}

/**
 * Use case that refreshes an authenticated session.
 */
export class RefreshSession {
  /** Repository for session persistence */
  #repository: AuthSessionRepository;

  /** Guard service for policy enforcement */
  #guard: AuthGuard;

  /** Event emitter for session lifecycle events */
  #emitter: AuthSessionEmitter;

  /**
   * @param repository - Session repository
   * @param guard - Guard used to validate the original session
   * @param emitter - Event emitter for lifecycle events
   */
  constructor(repository: AuthSessionRepository, guard: AuthGuard, emitter: AuthSessionEmitter) {
    this.#repository = repository;
    this.#guard = guard;
    this.#emitter = emitter;
  }

  /**
   * Executes session refresh.
   *
   * @param input - Refresh input
   * @param now - Current timestamp in milliseconds
   * @returns Refreshed session
   * @throws {Error} - If refresh cannot be completed
   */
  async execute(input: RefreshSessionInput, now: number): Promise<AuthSession> {
    // 1. Fetch original session
    const original = await this.#repository.get(input.originalId);

    // Defensive check: original session must exist
    if (!original) {
      throw new InvalidSessionError({ reason: AUTH_SESSION_INVARIANT_REASONS.SESSION_ID_MISSING });
    }

    // 2. Guard evaluation (invariants + revocation + assurance + refresh)
    this.#guard.assert(original, now, true);

    // 3. Build refreshed session
    const session: AuthSession = {
      ...original,
      // Rotate identifier while preserving original creation and verification time
      id: input.id,
      createdAt: original.createdAt,
      ...(input.expiresAt !== undefined ? { expiresAt: input.expiresAt } : {}),
    };

    // 4. Persist refreshed session
    await this.#repository.update(session);

    // 5. Emit event
    this.#emitter.sessionRefreshed({
      sessionId: session.id,
      originalId: original.id,
      refreshedAt: now,
      ...(session.expiresAt !== undefined ? { expiresAt: session.expiresAt } : {}),
    });

    return session;
  }
}
