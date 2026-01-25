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
 *
 */
export class DefaultHttpFacade implements HttpFacade {
  /** */
  private readonly state = new Lifecycle();

  /** */
  private readonly middleware: HttpMiddleware[] = [];

  /**  */
  private pipeline?: DefaultHttpPipeline;

  /**
   * @param emitter - the HTTP event emitter
   */
  constructor(private readonly emitter: HttpEvents) {}

  /**
   * @param {...HttpMiddleware[]} middlewares
   */
  use(...middlewares: readonly HttpMiddleware[]): void {
    if (!this.state.is("open")) {
      throw new InvalidLifecycleStateError({
        action: "use",
        state: this.state.state,
      });
    }

    this.middleware.push(...middlewares);
  }

  /**
   *
   */
  seal(): void {
    if (!this.state.is("open")) return;

    this.pipeline = new DefaultHttpPipeline(this.middleware);

    this.state.seal();
  }

  /**
   *
   * @param ctx
   */
  async handle(ctx: HttpContext): Promise<HttpResult> {
    const start = performance.now();

    if (this.state.is("open")) {
      this.seal();
    }

    if (!this.pipeline) {
      throw new InvalidLifecycleStateError({
        action: "handle",
        state: this.state.state,
      });
    }

    const startResult = this.state.start();
    if (!startResult.success) {
      // Just continue - we're already running
    }

    this.emitter.requestStarted({
      id: ctx.request.id,
      method: ctx.request.method,
      path: ctx.request.url.pathname,
    });

    try {
      await this.pipeline.execute(ctx);

      if (!ctx.response) {
        throw new DomainViolationError("HTTP pipeline completed without setting a response", {
          contract: "HttpMiddleware",
          expectation: "ctx.setResponse() must be called exactly once",
        });
      }

      const result = ctx.response;

      if (result.ok) {
        this.emitter.requestCompleted({
          id: ctx.request.id,
          status: result.response.status,
          duration: performance.now() - start,
        });
      }

      return result;
    } catch (cause) {
      // Normalize error
      const error =
        cause instanceof BaseError
          ? cause
          : new InternalError("Unhandled error in HTTP pipeline", {
              cause,
            });

      this.emitter.requestFailed({
        id: ctx.request.id,
        code: error.code,
        duration: performance.now() - start,
      });

      throw error;
    }
  }
}
