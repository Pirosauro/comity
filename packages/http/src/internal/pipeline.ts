import type { HttpContext } from "../contracts/context.js";
import type { HttpMiddleware } from "../contracts/middleware.js";
import type { HttpPipeline } from "../contracts/pipeline.js";

import { HttpMiddlewareContractViolationError } from "../errors/middleware-contract-violation.js";

/**
 * Default HTTP middleware pipeline implementation.
 *
 * @comity ai-jsdoc-skip
 */
export class DefaultHttpPipeline implements HttpPipeline {
  /** List of middleware functions. */
  #middlewares: readonly HttpMiddleware[];

  /**
   * @param middlewares - The middleware functions to include in the pipeline.
   */
  constructor(middlewares: readonly HttpMiddleware[]) {
    this.#middlewares = middlewares;
  }

  /**
   * Executes the middleware pipeline.
   * @param ctx - The HTTP context to pass through the middleware.
   * @throws {HttpMiddlewareContractViolationError} - If `HttpMiddleware.next()` is called multiple times.
   */
  async execute(ctx: HttpContext): Promise<void> {
    let index = -1;

    /**
     * Dispatches to middleware at the given index.
     * @param i - The current index in the middleware array.
     */
    const dispatch = async (i: number): Promise<void> => {
      if (i <= index) {
        throw new HttpMiddlewareContractViolationError(
          "HttpMiddleware.next() called multiple times"
        );
      }

      index = i;

      const middleware = this.#middlewares[i];

      if (!middleware) return;

      await middleware(ctx, () => dispatch(i + 1));
    };

    await dispatch(0);
  }
}
