import { ForbiddenError } from "@comity/core/errors";

/**
 * Error thrown when PostgreSQL denies access due to insufficient permissions.
 *
 * @remarks
 * Permission errors occur when the database user lacks the necessary privileges
 * to perform the requested operation on database objects.
 *
 * **HTTP Status Code**: 403 Forbidden
 *
 * **Common Causes:**
 * - Insufficient database user privileges
 * - Missing grants on tables/views/functions
 * - Schema access restrictions
 * - Row-level security policies
 *
 * **Recovery Strategies:**
 * - Grant appropriate permissions to database users
 * - Review database security policies
 * - Use different database users for different operations
 * - Implement proper authentication and authorization
 */
export class InsufficientPermissionsError extends ForbiddenError {
  constructor(message = "Insufficient database permissions") {
    super(message);

    this.name = "PostgresInsufficientPermissionsError";
  }
}
