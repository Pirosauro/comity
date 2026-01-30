import type { ErrorMeta } from "./types.js";

import { BaseError } from "./base.js";

/**
 * Error thrown when the rate limit has been exceeded.
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
 *   throw new RateLimitedError("Hourly request limit exceeded", {
 *     details: {
 *       limit: HOURLY_LIMIT,
 *       current: user.requestsThisHour,
 *       resetTime: getNextHour()
 *     }
 *   });
 * }
 *
 * // API quota exceeded
 * throw new RateLimitedError("API quota exceeded for this month", {
 *   details: { resetDate: getFirstDayOfNextMonth() }
 * });
 * ```
 */
export class RateLimitedError extends BaseError {
  readonly code = "core:rate-limited";

  /**
   * @param message Human-readable error message (defaults to "Rate limited")
   * @param meta Additional error metadata (limits, reset times, etc.)
   */
  constructor(message = "Rate limited", meta?: ErrorMeta) {
    super(message, {
      httpStatus: 429,
      ...meta,
    });
  }
}
