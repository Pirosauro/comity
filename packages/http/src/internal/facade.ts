import type { HttpContext } from "../contracts/context.js";
import type { HttpError } from "../contracts/error.js";
import type { HttpFacade } from "../contracts/facade.js";
import type { HttpMiddleware } from "../contracts/middleware.js";
import type { HttpResult } from "../contracts/result.js";
import type { HttpEvents } from "../lifecycle/events.js";

import { InvalidLifecycleStateError } from "../errors/invalid-lifecycle-state.js";
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
      throw new Error("HTTP pipeline not initialized");
    }

    this.state.running();

    this.emitter.requestStarted({
      id: ctx.request.id,
      method: ctx.request.method,
      path: ctx.request.url.pathname,
    });

    try {
      await this.pipeline.execute(ctx);

      const result = ctx.response!;

      this.emitter.requestCompleted({
        id: ctx.request.id,
        status: result.response.status,
        duration: performance.now() - start,
      });

      return result;
    } catch (error) {
      this.emitter.requestFailed({
        id: ctx.request.id,
        error: error as HttpError,
        duration: performance.now() - start,
      });

      throw error;
    }
  }
}
