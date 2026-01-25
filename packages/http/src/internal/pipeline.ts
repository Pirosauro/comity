import type { HttpContext } from "../contracts/context.js";
import type { HttpPipeline } from "../contracts/pipeline.js";
import { HttpMiddlewareContractViolationError } from "../errors/middleware-contract-violation.js";
import type { HttpMiddleware } from "../index.js";

/** Default HTTP middleware pipeline implementation. */
export class DefaultHttpPipeline implements HttpPipeline {
  constructor(private readonly middlewares: readonly HttpMiddleware[]) {}

  /**
   * @inheritdoc
   */
  async execute(ctx: HttpContext): Promise<void> {
    let index = -1;

    /**
     * Dispatches to middleware at the given index.
     * @param i
     */
    const dispatch = async (i: number): Promise<void> => {
      if (i <= index) {
        throw new HttpMiddlewareContractViolationError(
          "HttpMiddleware.next() called multiple times"
        );
      }

      index = i;

      const middleware = this.middlewares[i];

      if (!middleware) return;

      await middleware(ctx, () => dispatch(i + 1));
    };

    await dispatch(0);
  }
}
