import type { HttpFacade } from "./contracts/http-facade.js";
import type { HttpContext, HttpEvent } from "./core/context.js";
import type { HttpRequest } from "./core/request.js";
import type { HttpResult } from "./core/result.js";
import type { HttpState } from "./core/state.js";
import { createHttpState } from "./core/state.js";
import type { HttpPipeline } from "./pipeline/http.js";
import type { HttpMiddleware } from "./pipeline/middleware.js";

/**
 * Creates a default HttpState and a strongly typed helper to mutate it.
 * @returns An empty HttpState backed by an in-memory map.
 * @example
 * const state = createHttpState();
 * state.set("traceId", "abc123");
 */
export { createHttpState } from "./core/state.js";

/**
 * Creates a new HttpContext with single-response ownership enforcement.
 * @param request Immutable HTTP request snapshot.
 * @param signal Abort signal to observe request cancellation.
 * @param emit Event emitter for adapter/kernel integration.
 * @param options
 * @param options.request
 * @param options.signal
 * @param options.emit
 * @returns A mutable HttpContext for the request lifecycle.
 * @throws Error if setResponse is called more than once.
 * @example
 * const ctx = createHttpContext({ request, signal, emit });
 */
export function createHttpContext(options: {
  /**
   *
   */
  request: HttpRequest;
  /**
   *
   */
  signal?: AbortSignal;
  /**
   *
   */
  emit?: <E extends HttpEvent>(event: E) => void;
}): HttpContext {
  const state: HttpState = createHttpState();
  let response: HttpResult | undefined;
  const signal = options.signal ?? new AbortController().signal;
  const emit = options.emit ?? (() => {});

  /**
   *
   * @param result
   */
  const setResponse = (result: HttpResult): void => {
    if (response) {
      throw new Error("HTTP response already set");
    }
    response = result;
  };

  return {
    request: options.request,
    /**
     *
     */
    get response() {
      return response;
    },
    state,
    signal,
    emit,
    setResponse,
  };
}

/**
 * Creates an HttpPipeline that enforces next() ordering and single execution.
 * @param middleware Ordered middleware chain.
 * @returns An HttpPipeline executor.
 * @throws Error if next() is invoked multiple times.
 * @throws Error if no response is produced by the chain.
 * @example
 * const pipeline = createHttpPipeline(logger, handler);
 * const result = await pipeline.execute(ctx);
 */
export function createHttpPipeline(...middleware: readonly HttpMiddleware[]): HttpPipeline {
  return {
    /**
     *
     * @param ctx
     */
    async execute(ctx: HttpContext): Promise<HttpResult> {
      let index = -1;

      /**
       *
       * @param i
       */
      const dispatch = async (i: number): Promise<void> => {
        if (i <= index) {
          throw new Error("next() called multiple times");
        }
        index = i;
        const fn = middleware[i];
        if (!fn) return;
        await fn(ctx, () => dispatch(i + 1));
      };

      await dispatch(0);

      if (!ctx.response) {
        throw new Error("HTTP response not set");
      }

      return ctx.response;
    },
  };
}

/**
 * Creates an HttpFacade exposing a stable, minimal API surface.
 * @returns An HttpFacade with middleware registration and execution.
 * @example
 * const http = createHttpFacade();
 * http.use(logger, router);
 * const result = await http.handle(ctx);
 */
export function createHttpFacade(): HttpFacade {
  const middleware: HttpMiddleware[] = [];

  return {
    /**
     *
     * @param {...any} items
     */
    use(...items: readonly HttpMiddleware[]): void {
      middleware.push(...items);
    },
    /**
     *
     * @param ctx
     */
    async handle(ctx: HttpContext): Promise<HttpResult> {
      const pipeline = createHttpPipeline(...middleware);
      return pipeline.execute(ctx);
    },
  };
}
