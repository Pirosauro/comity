import type { ErrorMeta } from "./types.js";

import { BaseError } from "./base.js";

/**
 * Error thrown when the service is temporarily unavailable.
 *
 * @remarks
 * This error corresponds to HTTP 503 status and is typically thrown when
 * the service is undergoing maintenance, overloaded, or experiencing
 * temporary failures that prevent it from handling requests.
 *
 * @example
 * ```typescript
 * // Service maintenance
 * if (maintenanceMode) {
 *   throw new ServiceUnavailableError("Service is under maintenance", {
 *     details: { estimatedDowntime: "2 hours" }
 *   });
 * }
 *
 * // Database connection pool exhausted
 * if (dbConnections.available === 0) {
 *   throw new ServiceUnavailableError("Database connections exhausted", {
 *     details: { retryAfter: 30 }
 *   });
 * }
 * ```
 */
export class ServiceUnavailableError extends BaseError {
  readonly code = "core:service-unavailable";

  /**
   * @param message Human-readable error message (defaults to "Service unavailable")
   * @param meta Additional error metadata (retry timing, maintenance info, etc.)
   */
  constructor(message = "Service unavailable", meta?: ErrorMeta) {
    super(message, {
      httpStatus: 503,
      ...meta,
    });
  }
}
