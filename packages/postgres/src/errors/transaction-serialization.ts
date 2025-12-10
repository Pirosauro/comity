import { BadRequestError } from "@comity/core/errors";

/**
 * Error thrown when a PostgreSQL transaction fails due to serialization conflicts.
 *
 * @remarks
 * This error occurs when multiple transactions attempt to modify the same data
 * simultaneously under SERIALIZABLE isolation level, or when there are conflicts
 * that cannot be resolved. This is a recoverable error that can be retried.
 *
 * **HTTP Status Code**: 409 Conflict (or 503 for retries)
 *
 * **Common Causes:**
 * - Concurrent modifications to the same rows
 * - SERIALIZABLE isolation level conflicts
 * - Long-running transactions blocking each other
 *
 * **Recovery Strategies:**
 * - Implement retry logic with exponential backoff
 * - Consider reducing transaction isolation level if appropriate
 * - Break large transactions into smaller ones
 * - Use optimistic locking patterns
 */
export class TransactionSerializationError extends BadRequestError {
  constructor(message = "Transaction serialization conflict") {
    super(message);

    this.name = "PostgresTransactionSerializationError";
  }
}
