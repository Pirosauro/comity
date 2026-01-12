import type { ErrorMeta } from "./types.js";

import { BaseError } from "./base.js";

/**
 * Error thrown when the request rate limit has been exceeded.
 *
 * @remarks
 * This error corresponds to HTTP 429 status and is typically thrown when
 * rate limiting or throttling mechanisms prevent further requests from
 * being processed immediately.
 *
 * @example
 * ```typescript
 * // Rate limit exceeded
 * if (user.requestsThisHour >= HOURLY_LIMIT) {
 *   throw new TooManyRequestsError("Hourly request limit exceeded", {
 *     details: {
 *       limit: HOURLY_LIMIT,
 *       current: user.requestsThisHour,
 *       resetTime: getNextHour()
 *     }
 *   });
 * }
 *
 * // API quota exceeded
 * throw new TooManyRequestsError("API quota exceeded for this month", {
 *   details: { resetDate: getFirstDayOfNextMonth() }
 * });
 * ```
 */
export class TooManyRequestsError extends BaseError {
  readonly code = "TOO_MANY_REQUESTS";

  /**
   * @param message Human-readable error message (defaults to "Too many requests")
   * @param meta Additional error metadata (limits, reset times, etc.)
   */
  constructor(message = "Too many requests", meta?: ErrorMeta) {
    super(message, {
      httpStatus: 429,
      ...meta,
    });
  }
}
