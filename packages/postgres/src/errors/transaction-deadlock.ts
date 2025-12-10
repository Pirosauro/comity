import { BadRequestError } from "@comity/core/errors";

/**
 * Error thrown when a PostgreSQL transaction is aborted due to a deadlock.
 *
 * @remarks
 * Deadlocks occur when two or more transactions are waiting for each other
 * to release locks, creating a circular dependency. PostgreSQL automatically
 * detects and resolves deadlocks by aborting one of the transactions.
 *
 * **HTTP Status Code**: 409 Conflict
 *
 * **Common Causes:**
 * - Circular lock dependencies between transactions
 * - Inconsistent lock acquisition order
 * - Long-running transactions holding locks
 *
 * **Recovery Strategies:**
 * - Ensure consistent lock acquisition order across transactions
 * - Keep transactions as short as possible
 * - Implement retry logic for deadlock victims
 * - Consider using lower isolation levels for read operations
 */
export class TransactionDeadlockError extends BadRequestError {
  constructor(message = "Transaction deadlock detected") {
    super(message);

    this.name = "PostgresTransactionDeadlockError";
  }
}
