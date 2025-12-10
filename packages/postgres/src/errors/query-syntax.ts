import { BadRequestError } from "@comity/core/errors";

/**
 * Error thrown when PostgreSQL rejects a query due to syntax errors.
 *
 * @remarks
 * Syntax errors occur when SQL queries are malformed or contain invalid syntax.
 * This is typically a developer error that should be caught during development.
 *
 * **HTTP Status Code**: 400 Bad Request
 *
 * **Common Causes:**
 * - Malformed SQL syntax
 * - Invalid table/column names
 * - Incorrect SQL function usage
 * - Parameter binding issues
 *
 * **Recovery Strategies:**
 * - Validate SQL queries during development
 * - Use parameterized queries to prevent injection
 * - Implement proper error handling and logging
 * - Consider using query builders like Drizzle ORM
 */
export class QuerySyntaxError extends BadRequestError {
  constructor(message = "Invalid SQL query syntax") {
    super(message);

    this.name = "PostgresQuerySyntaxError";
  }
}
