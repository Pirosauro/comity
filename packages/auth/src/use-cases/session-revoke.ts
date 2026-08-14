import type { Result } from "@comity/primitives/result";
import type {
  AuthSessionCommands,
  AuthSessionRevocation,
} from "../contracts/session-commands.js";
import type { AuthSessionRepository } from "../contracts/session-repository.js";
import type { AuthSession } from "../contracts/session.js";
import type { AuthSessionObserver } from "../observers/session.js";
import type { AuthSessionId } from "../value-objects/auth-session-id.js";

import { AuthError } from "../errors/auth.js";

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
 * Domain command that revokes an authenticated session.
 *
 * @remarks
 * Implements `AuthSessionCommands`. Reads the session via the repository,
 * validates preconditions, mutates the session state (sets `revokedAt`) and
 * persists it via `save()`.
 */
export class RevokeSession implements AuthSessionCommands {
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
   * @param sessionId - Session identifier to revoke
   * @param metadata - Revocation metadata (reason, timestamp, actor)
   *
   * @returns Success, or a domain error (`session_not_found`,
   * `session_revoked`, `internal_error`).
   */
  async revoke(
    sessionId: AuthSessionId,
    metadata: AuthSessionRevocation
  ): Promise<Result<void, AuthError>> {
    // 1. Read session
    const fetched = await this.#repository.getById(sessionId);

    if (!fetched.success) {
      if (fetched.error instanceof AuthError) {
        return { success: false, error: fetched.error };
      }

      return {
        success: false,
        error: new AuthError("internal_error", {
          details: {
            policy: "persistence",
            subject: sessionId.toString(),
          },
          cause: fetched.error,
        }),
      };
    }

    const session = fetched.value;

    if (!session) {
      return {
        success: false,
        error: new AuthError("session_not_found", {
          details: {
            subject: sessionId.toString(),
          },
        }),
      };
    }

    // 2. Validate preconditions: not already revoked
    if (session.revokedAt !== undefined) {
      return {
        success: false,
        error: new AuthError("session_revoked", {
          details: {
            subject: sessionId.toString(),
          },
        }),
      };
    }

    // 3. Mutate session state
    const revoked: AuthSession = {
      ...session,
      revokedAt: metadata.at,
    };

    // 4. Persist
    const persisted = await this.#repository.save(revoked);

    if (!persisted.success) {
      if (persisted.error instanceof AuthError) {
        return { success: false, error: persisted.error };
      }

      return {
        success: false,
        error: new AuthError("internal_error", {
          details: {
            policy: "persistence",
            subject: sessionId.toString(),
          },
          cause: persisted.error,
        }),
      };
    }

    // 5. Emit lifecycle event
    this.#observer.onSessionRevoked({
      sessionId,
      reason: metadata.reason,
      revokedAt: metadata.at,
    });

    return { success: true, value: undefined };
  }

  /**
   * Best-effort facade wrapper.
   *
   * @remarks
   * Delegates to `revoke()` and swallows failures, preserving the facade's
   * `Promise<void>` contract. Callers that need domain errors should use
   * `revoke()` directly.
   *
   * @param input - Revocation input
   * @param now - Current timestamp in milliseconds
   */
  async execute(input: RevokeSessionInput, now: number): Promise<void> {
    await this.revoke(input.id, {
      reason: input.reason,
      at: now,
      ...(input.actor ? { actor: input.actor } : {}),
    });
  }
}