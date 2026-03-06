import type { AuthSessionRepository } from "../contracts/session-repository.js";
import type { AuthSession, AuthSessionId } from "../contracts/session.js";
import type { AuthGuard } from "../guard.js";
import type { AuthSessionEmitter } from "../lifecycle/session.js";

import type { Result } from "@comity/primitives/result";
import { AuthError } from "../error/auth.js";

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
   *
   * @returns Refreshed session
   *
   * @throws {AuthError} - If refresh cannot be completed
   */
  async execute(
    input: RefreshSessionInput,
    now: number
  ): Promise<Result<AuthSession, AuthError, "ok">> {
    try {
      // 1. Fetch original session
      const original = await this.#repository.get(input.originalId);

      // Defensive check: original session must exist
      if (!original) {
        throw new AuthError("session_not_found", {
          subject: input.originalId,
        });
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
      this.#emitter.onSessionRefreshed({
        sessionId: session.id,
        originalId: original.id,
        refreshedAt: now,
        ...(session.expiresAt !== undefined ? { expiresAt: session.expiresAt } : {}),
      });

      return { ok: true, value: session };
    } catch (error) {
      if (error instanceof AuthError) {
        return { ok: false, error };
      }

      return {
        ok: false,
        error: new AuthError("internal_error", {
          policy: "persistence",
          subject: input.id,
          cause: error,
        }),
      };
    }
  }
}
