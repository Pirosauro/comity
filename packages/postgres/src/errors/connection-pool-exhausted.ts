import { ServiceUnavailableError } from "@comity/core/errors";

/**
 * Error thrown when PostgreSQL connection pool is exhausted.
 *
 * @remarks
 * Connection pool exhaustion occurs when all available database connections
 * are in use and no more connections can be established within the configured limits.
 *
 * **HTTP Status Code**: 503 Service Unavailable
 *
 * **Common Causes:**
 * - High concurrent load exceeding pool capacity
 * - Connection leaks (not properly releasing connections)
 * - Long-running queries consuming connections
 * - Insufficient pool configuration
 *
 * **Recovery Strategies:**
 * - Increase connection pool size if appropriate
 * - Implement connection pooling best practices
 * - Monitor connection pool metrics
 * - Optimize query performance to reduce connection usage time
 */
export class ConnectionPoolExhaustedError extends ServiceUnavailableError {
  constructor(message = "Database connection pool exhausted") {
    super(message);

    this.name = "PostgresConnectionPoolExhaustedError";
  }
}
