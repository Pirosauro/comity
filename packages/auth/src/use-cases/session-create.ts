import type {
  AuthSessionAssuranceEvaluator,
  AuthSessionAssuranceInput,
} from "../contracts/session-assurance-evaluator.js";
import type { AuthSessionRepository } from "../contracts/session-repository.js";
import type { AuthSessionTransport } from "../contracts/session-transport.js";
import type { AuthSession, AuthSessionId } from "../contracts/session.js";
import type { AuthSessionEmitter } from "../events/session.js";
import type { AuthGuard } from "../services/guard.js";

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

  /** Event emitter for session lifecycle events */
  #emitter: AuthSessionEmitter;

  /** Guard service for policy enforcement */
  #guard: AuthGuard;

  /**
   * @param repository - Session repository
   * @param evaluator - Assurance evaluator
   * @param emitter - Event emitter for lifecycle events
   * @param guard - Guard used to validate created sessions
   */
  constructor(
    repository: AuthSessionRepository,
    evaluator: AuthSessionAssuranceEvaluator,
    emitter: AuthSessionEmitter,
    guard: AuthGuard
  ) {
    this.#repository = repository;
    this.#evaluator = evaluator;
    this.#emitter = emitter;
    this.#guard = guard;
  }

  /**
   * Executes session creation.
   *
   * @param input - Session creation input
   * @param now - Current timestamp in milliseconds
   * @returns Created session
   * @throws {InvalidSessionError | AssuranceRequiredError} - If creation fails
   */
  async execute(input: CreateSessionInput, now: number): Promise<AuthSession> {
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
    this.#guard.assertInvariants(session, now);
    this.#guard.assertAssurance(session, now);

    // 3. Enforce refresh requirements
    if (session.refresh?.enabled) {
      this.#guard.assertRefreshable(session, now);
    }

    // 4. Persist session
    await this.#repository.create(session);

    // 5. Emit event
    this.#emitter.sessionCreated({
      sessionId: session.id,
      createdAt: session.createdAt,
      assuranceScore: session.assurance.score,
    });

    return session;
  }
}
