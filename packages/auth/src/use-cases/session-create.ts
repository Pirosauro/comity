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
 * Input used to create a new authenticated session.
 */
export interface CreateSessionInput extends AuthSessionAssuranceInput {
  /** Session identifier */
  readonly id: AuthSessionId;

  /** Hard expiration */
  readonly expiresAt?: number;

  /** Session transport mechanism */
  readonly transport: AuthSessionTransport;

  /** Refresh capabilities */
  readonly refresh?: false | number; // false = disabled, number = expiresAt

  /** Step-up parent */
  readonly parent?: AuthSessionId;

  /** Authorization scopes */
  readonly scopes?: readonly string[];
}

/**
 * Use case that creates a new authenticated session.
 */
export class CreateSession {
  /** Repository for session persistence */
  #repository: AuthSessionRepository;

  /** Evaluator for session assurance */
  #evaluator: AuthSessionAssuranceEvaluator;

  /** Event observer for session lifecycle events */
  #observer: AuthSessionObserver;

  /** Guard service for policy enforcement */
  #guard: AuthGuard;

  /**
   * @param repository - Session repository
   * @param evaluator - Assurance evaluator
   * @param observer - Event observer for lifecycle events
   * @param guard - Guard used to validate created sessions
   */
  constructor(
    repository: AuthSessionRepository,
    evaluator: AuthSessionAssuranceEvaluator,
    observer: AuthSessionObserver,
    guard: AuthGuard
  ) {
    this.#repository = repository;
    this.#evaluator = evaluator;
    this.#observer = observer;
    this.#guard = guard;
  }

  /**
   * Executes session creation.
   *
   * @param input - Session creation input
   * @param now - Current timestamp in milliseconds
   *
   * @returns Created session
   */
  async execute(
    input: CreateSessionInput,
    now: number
  ): Promise<Result<AuthSession, AuthError, "ok">> {
    // 1. Build session
    const assurance = this.#evaluator.evaluate(
      {
        methods: input.methods,
        ...(input.proof !== undefined ? { proof: input.proof } : {}),
        ...(input.context !== undefined ? { context: input.context } : {}),
        version: input.version,
      },
      now
    );
    const session: AuthSession = {
      id: input.id,
      createdAt: now,
      verifiedAt: now,
      assurance,
      transport: input.transport,
      ...(input.expiresAt !== undefined ? { expiresAt: input.expiresAt } : {}),
      ...(input.refresh !== undefined
        ? {
            refresh:
              typeof input.refresh === "number"
                ? { enabled: true, expiresAt: input.refresh }
                : { enabled: false },
          }
        : {}),
      ...(input.parent !== undefined
        ? {
            stepUp: {
              parent: input.parent,
              at: now,
            },
          }
        : {}),
      ...(input.scopes !== undefined ? { scopes: input.scopes } : {}),
    };

    // 2. Enforce assurance requirements
    try {
      this.#guard.assertInvariants(session, now);
      this.#guard.assertAssurance(session, now);

      // 3. Enforce refresh requirements
      if (session.refresh?.enabled) {
        this.#guard.assertRefreshable(session, now);
      }
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

    // 4. Persist session
    const persisted = await this.#repository.save(session);

    if (!persisted.success) {
      // Map infrastructure errors to AuthError("internal_error") for the use-case contract.
      if (persisted.error instanceof AuthError) {
        return { ok: false, error: persisted.error };
      }

      return {
        ok: false,
        error: new AuthError("internal_error", {
          details: {
            policy: "persistence",
          },
          cause: persisted.error,
        }),
      };
    }

    // 5. Emit event
    this.#observer.onSessionCreated({
      sessionId: session.id,
      createdAt: session.createdAt,
      assuranceScore: session.assurance.score,
    });

    return { ok: true, value: session };
  }
}
