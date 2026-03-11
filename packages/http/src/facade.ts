import type { HttpContext } from "./contracts/context.js";
import type { HttpHandler } from "./contracts/handler.js";
import type { HttpResponse } from "./contracts/response.js";
import type { HttpObserver } from "./hooks/observer.js";

import { toSafePayload } from "@comity/primitives/error";

/**
 * HTTP Facade that provides a simplified interface for handling HTTP requests.
 */
export class HttpFacade {
  /** The HTTP handler function to be invoked for each request. */
  #handler: HttpHandler;

  /** Optional HTTP observer for emitting lifecycle events during request handling. */
  #observer: HttpObserver | undefined;

  /**
   * @param handler - The HTTP handler function to be invoked for each request.
   * @param observer - Optional HTTP observer for emitting lifecycle events during request handling.
   */
  constructor(handler: HttpHandler, observer?: HttpObserver) {
    this.#handler = handler;
    this.#observer = observer;
  }

  /**
   * Handles an incoming HTTP request by invoking the underlying handler with the provided context.
   *
   * @param ctx - The HTTP context for the current request.
   *
   * @returns A promise that resolves to an HTTP response.
   *
   * @throws {Error} If an unexpected error occurs during the execution of the handler.
   */
  async handle(ctx: HttpContext): Promise<HttpResponse> {
    const start = performance.now();

    // 1. Emit request started event
    this.#observer?.onRequestStarted?.(ctx.request);

    try {
      // 2. Invoke the underlying handler to process the request
      const response = await this.#handler(ctx);

      // 3. Emit request completed event with response and duration
      this.#observer?.onRequestCompleted?.({
        request: ctx.request,
        response,
        duration: performance.now() - start,
      });

      return response;
    } catch (error) {
      // 4. Emit request failed event with error and duration
      this.#observer?.onRequestFailed?.({
        request: ctx.request,
        error: toSafePayload(error),
        duration: performance.now() - start,
      });

      throw error;
    }
  }
}
