import type { ErrorMeta } from "./types.js";

import { BaseError } from "./base.js";

/**
 * Error thrown when an unexpected internal error occurs.
 *
 * @remarks
 * This error corresponds to HTTP 500 status and is typically thrown when
 * unexpected system failures occur that cannot be handled gracefully.
 * This should be used sparingly and usually indicates a bug or system issue.
 *
 * @example
 * ```typescript
 * // Unexpected database error
 * try {
 *   await db.query(sql);
 * } catch (error) {
 *   throw new InternalError("Database operation failed", {
 *     cause: error,
 *     details: { operation: "query", sql: sql.substring(0, 100) }
 *   });
 * }
 *
 * // System configuration error
 * if (!config.databaseUrl) {
 *   throw new InternalError("Database configuration missing");
 * }
 * ```
 */
export class InternalError extends BaseError {
  readonly code = "core:internal";

  /**
   * @param message Human-readable error message (defaults to "Internal error")
   * @param meta Additional error metadata (cause, context, etc.)
   */
  constructor(message = "Internal error", meta?: ErrorMeta) {
    super(message, {
      httpStatus: 500,
      ...meta,
    });
  }
}
