import type { HttpRequest } from "./request.js";

/**
 * HTTP execution context for the entire request lifecycle.
 */
export interface HttpContext<State = Record<string, unknown>> {
  /** Immutable snapshot of the incoming HTTP request. */
  readonly request: HttpRequest;

  /** Abort signal (client disconnect, timeout, etc.). */
  readonly signal: AbortSignal;

  /** Mutable state for the current request. */
  readonly state: State;
}
