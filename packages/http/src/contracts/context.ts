import type { HttpRequest } from "./request.js";
import type { HttpResult } from "./result.js";
import type { HttpState } from "./state.js";

/**
 * HTTP execution context for the entire request lifecycle.
 *
 * @generator MAGI
 */
export interface HttpContext {
  /** Immutable snapshot of the incoming HTTP request. */
  readonly request: HttpRequest;

  /** Current response (undefined until explicitly set). */
  readonly response: HttpResult | undefined;

  /** Shared mutable state passed across middleware. */
  readonly state: HttpState;

  /** Abort signal (client disconnect, timeout, etc.). */
  readonly signal: AbortSignal;

  /**
   * Finalizes the response (can only be called once).
   *
   * @param result - Final HTTP result.
   *
   * @throws {Error} - If called more than once.
   */
  setResponse(result: HttpResult): void;
}
