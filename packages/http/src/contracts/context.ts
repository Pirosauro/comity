import type { HttpRequest } from "./request.js";
import type { HttpResult } from "./result.js";

/**
 * HTTP execution context for the entire request lifecycle.
 */
export interface HttpContext {
  /** Immutable snapshot of the incoming HTTP request. */
  readonly request: HttpRequest;

  /** Current response (undefined until explicitly set). */
  readonly response: HttpResult | undefined;

  /** Abort signal (client disconnect, timeout, etc.). */
  readonly signal: AbortSignal;
}
