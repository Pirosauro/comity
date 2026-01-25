import type { HttpContext } from "../contracts/context.js";
import type { HttpFacade } from "../contracts/facade.js";
import type { HttpMiddleware } from "../contracts/middleware.js";
import type { HttpResult } from "../contracts/result.js";
import type { HttpEvents } from "../lifecycle/events.js";

import { BaseError, DomainViolationError, InternalError } from "@comity/primitives/errors";

import { InvalidLifecycleStateError } from "../errors/invalid-lifecycle-state.js";
import { Lifecycle } from "./lifecycle.js";
import { DefaultHttpPipeline } from "./pipeline.js";

/**
 * Default implementation of the HttpFacade interface.
 *
 * @remarks
 * Coordinates:
 * - lifecycle
 * - middleware registration
 * - pipeline execution
 * - event emission
 *
 * @comity ai-jsdoc-skip
 */
export class DefaultHttpFacade implements HttpFacade {
  /** Lifecycle state of the facade. */
  #state = new Lifecycle();

  /** Registered middleware functions (ordered). */
  #middlewares: HttpMiddleware[] = [];

  /** Sealed HTTP pipeline. */
  #pipeline?: DefaultHttpPipeline;

  /** Emitter */
  #emitter: HttpEvents;

  /**
   * @param emitter - HTTP lifecycle event emitter
   */
  constructor(emitter: HttpEvents) {
    this.#emitter = emitter;
  }

  /** @inheritdoc */
  use(...middlewares: readonly HttpMiddleware[]): void {
    if (!this.#state.is("open")) {
      throw new InvalidLifecycleStateError({
        action: "use",
        state: this.#state.state,
      });
    }

    this.#middlewares.push(...middlewares);
  }

  /**
   * Seals the facade and builds the execution pipeline.
   *
   * Idempotent: calling multiple times has no effect after sealing.
   */
  seal(): void {
    if (!this.#state.is("open")) return;

    this.#pipeline = new DefaultHttpPipeline(this.#middlewares);
    this.#state.seal();
  }

  /** @inheritdoc */
  async handle(ctx: HttpContext): Promise<HttpResult> {
    const start = performance.now();

    // Implicit sealing on first execution
    if (this.#state.is("open")) {
      this.seal();
    }

    if (!this.#pipeline) {
      throw new InvalidLifecycleStateError({
        action: "handle",
        state: this.#state.state,
      });
    }

    // Transition to running if needed.
    // If already running, continue (re-entrant by design).
    this.#state.start();

    this.#emitter.requestStarted({
      id: ctx.request.id,
      method: ctx.request.method,
      path: ctx.request.url.pathname,
    });

    try {
      await this.#pipeline.execute(ctx);

      if (!ctx.response) {
        throw new DomainViolationError("HTTP pipeline completed without setting a response", {
          contract: "HttpMiddleware",
          expectation: "ctx.setResponse() must be called exactly once",
        });
      }

      const result = ctx.response;

      this.#emitter.requestCompleted({
        id: ctx.request.id,
        status: result.ok ? result.response.status : 0,
        duration: performance.now() - start,
      });

      return result;
    } catch (cause) {
      const error =
        cause instanceof BaseError
          ? cause
          : new InternalError("Unhandled error in HTTP pipeline", { cause });

      this.#emitter.requestFailed({
        id: ctx.request.id,
        code: error.code,
        duration: performance.now() - start,
      });

      throw error;
    }
  }
}
