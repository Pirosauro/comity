import { BadRequestError } from "@comity/core/errors";

/**
 * Error thrown when PostgreSQL encounters constraint violations.
 *
 * @remarks
 * Constraint violations occur when data modifications conflict with database
 * constraints such as primary keys, foreign keys, unique constraints, or check constraints.
 *
 * **HTTP Status Code**: 400 Bad Request
 *
 * **Common Causes:**
 * - Duplicate primary key values
 * - Foreign key constraint violations
 * - Unique constraint violations
 * - Check constraint failures
 * - NOT NULL constraint violations
 *
 * **Recovery Strategies:**
 * - Validate data before database operations
 * - Implement proper error handling for constraint violations
 * - Use database transactions for atomic operations
 * - Consider using upsert operations where appropriate
 */
export class ConstraintViolationError extends BadRequestError {
  constructor(message = "Database constraint violation") {
    super(message);

    this.name = "PostgresConstraintViolationError";
  }
}
