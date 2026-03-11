import type { HttpContext } from "./contracts/context.js";
import type { HttpHandler } from "./contracts/handler.js";
import type { HttpMiddleware } from "./contracts/middleware.js";
import type { HttpResponse } from "./contracts/response.js";

import { HttpError } from "./error/http.js";

/**
 * Creates an HTTP handler function that executes the provided middleware in order before invoking the main handler.
 *
 * @param middleware - Array of middleware functions to be executed in order.
 * @param handler - Main HTTP handler function to be invoked after all middleware have been executed.
 *
 * @returns An HTTP handler function that can be used to handle incoming HTTP requests.
 *
 * @throws Propagates errors thrown by middleware or the main handler; does not alter error semantics.
 */
export function createHttpHandler(middleware: HttpMiddleware[], handler: HttpHandler): HttpHandler {
  return async (ctx: HttpContext) => {
    let index = -1;

    /**
     * Dispatches the middleware at the given index, or the main handler if all middleware have been executed.
     *
     * @param i - Index of the middleware to execute.
     *
     * @returns A promise that resolves to an HTTP response.
     *
     * @throws Propagates errors thrown by middleware or the main handler; does not alter error semantics.
     */
    async function dispatch(i: number): Promise<HttpResponse> {
      if (i <= index) {
        throw new HttpError("pipeline_contract_violation", {
          context: {
            violation: "next_called_multiple_times",
            middlewareIndex: i,
          },
        });
      }

      index = i;

      const fn = middleware[i];

      if (fn) {
        return fn(ctx, () => dispatch(i + 1));
      }

      return await handler(ctx);
    }

    return await dispatch(0);
  };
}
