import type { ErrorMeta } from "./types.js";

import { BaseError } from "./base.js";

/**
 * Error thrown when an operation exceeds the allotted time limit.
 *
 * @remarks
 * This error corresponds to HTTP 408 status and is typically thrown when
 * a request takes too long to complete, indicating a timeout condition.
 *
 * @example
 * ```typescript
 * // Request timeout
 * const controller = new AbortController();
 * const timeoutId = setTimeout(() => controller.abort(), 5000);
 *
 * try {
 *   const response = await fetch(url, { signal: controller.signal });
 * } catch (error) {
 *   if (error.name === "AbortError") {
 *     throw new TimeoutError("Request timed out", {
 *       details: { url }
 *     });
 *   }
 * } finally {
 *   clearTimeout(timeoutId);
 * }
 * ```
 */
export class TimeoutError extends BaseError {
  readonly code = "core:timeout";

  /**
   * @param message Human-readable error message (defaults to "Operation timed out")
   * @param meta Additional metadata for the error
   */
  constructor(message = "Operation timed out", meta: ErrorMeta = {}) {
    super(message, { httpStatus: 408, ...meta });
  }
}
