import { ServiceUnavailableError } from "@comity/core/errors";

/**
 * Error thrown when a PostgreSQL query exceeds the configured timeout.
 *
 * @remarks
 * Query timeouts prevent long-running queries from consuming excessive
 * database resources. This can occur due to complex queries, large datasets,
 * or performance issues.
 *
 * **HTTP Status Code**: 504 Gateway Timeout
 *
 * **Common Causes:**
 * - Complex queries without proper indexing
 * - Large result sets
 * - Network latency issues
 * - Database performance problems
 *
 * **Recovery Strategies:**
 * - Optimize query performance with proper indexing
 * - Implement query result pagination
 * - Increase timeout values for legitimate long-running operations
 * - Monitor query execution plans
 */
export class QueryTimeoutError extends ServiceUnavailableError {
  constructor(message = "Query execution timeout") {
    super(message);

    this.name = "PostgresQueryTimeoutError";
  }
}
