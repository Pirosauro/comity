import type { HttpRequest } from "./request.js";
import type { HttpResult } from "./result.js";
import type { HttpState } from "./state.js";

/**
 * HTTP execution context.
 *
 * Lives for the entire request lifecycle.
 * Mutable by middleware.
 */
export interface HttpContext {
  /**
   * Incoming HTTP request.
   *
   * Immutable snapshot.
   */
  readonly request: HttpRequest;

  /**
   * Current response.
   *
   * Undefined until explicitly set.
   */
  readonly response: HttpResult | undefined;

  /**
   * Shared mutable state for the pipeline.
   *
   * Used to pass data across middleware.
   */
  readonly state: HttpState;

  /**
   * Abort signal (client disconnect, timeout, etc.)
   */
  readonly signal: AbortSignal;

  /**
   * Finalizes the response.
   *
   * Can only be called once.
   * Subsequent calls MUST throw.
   * @param result The final HTTP result.
   * @throws Error when called more than once.
   * @example
   * ctx.setResponse({ ok: true, response: { status: 204 } });
   */
  setResponse(result: HttpResult): void;
}
