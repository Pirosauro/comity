import type { Result } from "@comity/primitives/result";
import type {
  AuthSessionAssuranceEvaluator,
  AuthSessionAssuranceInput,
} from "../contracts/session-assurance-evaluator.js";
import type { AuthSessionRepository } from "../contracts/session-repository.js";
import type { AuthSessionTransport } from "../contracts/session-transport.js";
import type { AuthSession } from "../contracts/session.js";
import type { AuthGuard } from "../guard.js";
import type { AuthSessionObserver } from "../hooks/session.js";
import type { AuthSessionId } from "../value-objects/auth-session-id.js";

import { AuthError } from "../errors/auth.js";

/**
 * Input used to perform a session step-up.
 */
export interface StepUpSessionInput extends AuthSessionAssuranceInput {
  /** Parent session */
  readonly parentId: AuthSessionId;

  /** New session identifier */
  readonly id: AuthSessionId;

  /** Session transport mechanism */
  readonly transport: AuthSessionTransport;

  /** Optional hard expiration */
  readonly expiresAt?: number;

  /** Refresh configuration */
  readonly refresh?: false | number;

  /** Authorization scopes */
  readonly scopes?: readonly string[];
}

/**
 * Use case that performs a session step-up.
 */
export class StepUpSession {
  #repository: AuthSessionRepository;
  #evaluator: AuthSessionAssuranceEvaluator;
  #guard: AuthGuard;
  #observer: AuthSessionObserver;

  /**
   * @param repository - Session repository
   * @param evaluator - Assurance evaluator
   * @param guard - Guard used to validate sessions
   * @param observer - Event observer for lifecycle events
   */
  constructor(
    repository: AuthSessionRepository,
    evaluator: AuthSessionAssuranceEvaluator,
    guard: AuthGuard,
    observer: AuthSessionObserver
  ) {
    this.#repository = repository;
    this.#evaluator = evaluator;
    this.#guard = guard;
    this.#observer = observer;
  }

  /**
   * Executes session step-up.
   *
   * @param input - Step-up input
   * @param now - Current timestamp in milliseconds
   *
   * @returns New stepped-up session
   */
  async execute(
    input: StepUpSessionInput,
    now: number
  ): Promise<Result<AuthSession, AuthError, "ok">> {
    // 1. Load parent session
    const fetched = await this.#repository.getById(input.parentId);

    if (!fetched.success) {
      if (fetched.error instanceof AuthError) {
        return { ok: false, error: fetched.error };
      }

      return {
        ok: false,
        error: new AuthError("internal_error", {
          details: {
            policy: "persistence",
            subject: input.id.toString(),
          },
          cause: fetched.error,
        }),
      };
    }

    const parent = fetched.value;

    if (!parent) {
      return {
        ok: false,
        error: new AuthError("session_not_found", {
          details: {
            subject: input.parentId.toString(),
          },
        }),
      };
    }

    // 2. Parent must be valid
    try {
      this.#guard.assert(parent, now);
    } catch (error) {
      if (error instanceof AuthError) {
        return { ok: false, error };
      }

      return {
        ok: false,
        error: new AuthError("internal_error", {
          details: {
            policy: "guard",
          },
          cause: error instanceof Error ? error : undefined,
        }),
      };
    }

    // 3. Evaluate new assurance
    const assurance = this.#evaluator.evaluate(
      {
        methods: input.methods,
        ...(input.proof !== undefined ? { proof: input.proof } : {}),
        ...(input.context !== undefined ? { context: input.context } : {}),
        version: input.version,
      },
      now
    );

    // 4. New assurance must be stronger
    if (assurance.score <= parent.assurance.score) {
      return {
        ok: false,
        error: new AuthError("assurance_step_up_required", {
          details: {
            policy: "step_up",
          },
          context: {
            requiredScore: parent.assurance.score + 1,
            actualScore: assurance.score,
          },
        }),
      };
    }

    // 5. Build new session
    const session: AuthSession = {
      id: input.id,
      createdAt: now,
      // Step-up represents a new strong authentication at `now`
      verifiedAt: now,
      assurance,
      transport: input.transport,
      ...(input.expiresAt !== undefined ? { expiresAt: input.expiresAt } : {}),
      stepUp: {
        parent: parent.id,
        at: now,
      },
      ...(input.scopes !== undefined ? { scopes: input.scopes } : {}),
    };

    // 6. Enforce policies on new session
    try {
      this.#guard.assert(session, now);
    } catch (error) {
      if (error instanceof AuthError) {
        return { ok: false, error };
      }

      return {
        ok: false,
        error: new AuthError("internal_error", {
          details: {
            policy: "guard",
          },
          cause: error instanceof Error ? error : undefined,
        }),
      };
    }

    // 7. Persist new session
    const persisted = await this.#repository.save(session);

    if (!persisted.success) {
      if (persisted.error instanceof AuthError) {
        return { ok: false, error: persisted.error };
      }

      return {
        ok: false,
        error: new AuthError("internal_error", {
          details: {
            policy: "persistence",
            subject: input.id.toString(),
          },
          cause: persisted.error,
        }),
      };
    }

    // 8. Emit event
    this.#observer.onStepUpCompleted({
      sessionId: session.id,
      parentId: parent.id,
      assuranceScore: assurance.score,
      at: now,
    });

    return { ok: true, value: session };
  }
}
