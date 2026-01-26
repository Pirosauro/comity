import type { HttpContext } from "../contracts/context.js";
import type { HttpMiddleware } from "../contracts/middleware.js";
import type { HttpPipeline } from "../contracts/pipeline.js";

import { HttpMiddlewareContractViolationError } from "../errors/middleware-contract-violation.js";

/**
 * Default HTTP middleware pipeline implementation.
 *
 * @remarks
 * Executes middleware sequentially using a Koa-style `next()` contract.
 *
 * Rules:
 * - `next()` may be called at most once per middleware
 * - middleware must either call `next()` or finalize the response via `ctx.setResponse()`
 *
 * @comity ai-jsdoc-skip
 */
export class DefaultHttpPipeline implements HttpPipeline {
  /** Ordered list of middleware functions. */
  #middlewares: readonly HttpMiddleware[];

  /**
   * @param middlewares - The middleware functions to execute.
   */
  constructor(middlewares: readonly HttpMiddleware[]) {
    this.#middlewares = middlewares;
  }

  /**
   * Executes the middleware pipeline.
   *
   * @param ctx - The HTTP context.
   * @throws {HttpMiddlewareContractViolationError} If `next()` is called multiple times.
   */
  async execute(ctx: HttpContext): Promise<void> {
    let index = -1;

    /**
     * Dispatches the middleware at the given index.
     *
     * @param i - The index of the middleware to dispatch.
     */
    const dispatch = async (i: number): Promise<void> => {
      if (i <= index) {
        throw new HttpMiddlewareContractViolationError(
          "HttpMiddleware.next() called multiple times"
        );
      }

      index = i;

      const middleware = this.#middlewares[i];

      // No more middleware to execute
      if (!middleware) return;

      // Execute the current middleware
      await middleware(ctx, async () => {
        await dispatch(i + 1);
      });
    };

    await dispatch(0);
  }
}
