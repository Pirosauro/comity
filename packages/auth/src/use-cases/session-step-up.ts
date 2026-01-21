import type {
  AuthSessionAssuranceEvaluator,
  AuthSessionAssuranceInput,
} from "../contracts/session-assurance-evaluator.js";
import type { AuthSessionRepository } from "../contracts/session-repository.js";
import type { AuthSessionTransport } from "../contracts/session-transport.js";
import type { AuthSession, AuthSessionId } from "../contracts/session.js";
import type { AuthSessionEmitter } from "../events/session.js";
import type { AuthGuard } from "../services/guard.js";

import { AssuranceRequiredError } from "../errors/assurance-required.js";

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
  #emitter: AuthSessionEmitter;

  /**
   * @param repository - Session repository
   * @param evaluator - Assurance evaluator
   * @param guard - Guard used to validate sessions
   * @param emitter - Event emitter for lifecycle events
   */
  constructor(
    repository: AuthSessionRepository,
    evaluator: AuthSessionAssuranceEvaluator,
    guard: AuthGuard,
    emitter: AuthSessionEmitter
  ) {
    this.#repository = repository;
    this.#evaluator = evaluator;
    this.#guard = guard;
    this.#emitter = emitter;
  }

  /**
   * Executes session step-up.
   *
   * @param input - Step-up input
   * @param now - Current timestamp in milliseconds
   * @returns New stepped-up session
   * @throws {AssuranceRequiredError} - If the new assurance is insufficient
   */
  async execute(input: StepUpSessionInput, now: number): Promise<AuthSession> {
    // 1. Load parent session (throws if not found)
    const parent = await this.#repository.get(input.parentId);

    // 2. Parent must be valid
    this.#guard.assert(parent, now);

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
      throw new AssuranceRequiredError({
        reason: "step_up_insufficient",
        policy: "step_up",
        requiredScore: parent.assurance.score + 1,
        actualScore: assurance.score,
      });
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
    this.#guard.assert(session, now);

    // 7. Persist new session
    await this.#repository.create(session);

    // 8. Emit event
    this.#emitter.stepUpCompleted({
      sessionId: session.id,
      parentId: parent.id,
      assuranceScore: assurance.score,
      at: now,
    });

    return session;
  }
}
