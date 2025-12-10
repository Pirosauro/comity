import { ServiceUnavailableError } from "@comity/core/errors";

/**
 * Error thrown when database connection or initialization fails.
 *
 * @remarks
 * This error represents database connectivity and configuration issues that
 * prevent the application from establishing a working database connection.
 * It should be used when:
 *
 * - Database connection string is missing or invalid
 * - Database server is unreachable or unavailable
 * - Authentication credentials are rejected
 * - Connection pool initialization fails
 * - Database health checks fail during startup
 *
 * **HTTP Status Code**: 503 Service Unavailable
 *
 * **Error Categories:**
 * - **Configuration**: Missing or invalid connection parameters
 * - **Network**: Connection timeout or unreachable database server
 * - **Authentication**: Invalid credentials or permission denied
 * - **Resource**: Connection pool exhaustion or database overload
 * - **Health**: Database health checks failing during initialization
 *
 * **Recovery Strategies:**
 * - Verify database connection configuration
 * - Check database server status and availability
 * - Validate authentication credentials
 * - Monitor connection pool metrics
 * - Implement connection retry mechanisms
 *
 * @example
 * Database configuration validation
 * ```typescript
 * import { DatabaseConnectionError } from '@comity/postgres/errors';
 *
 * function validateDatabaseConfig(config: DatabaseConfig) {
 *   if (!config.url && !config.host) {
 *     throw new DatabaseConnectionError(
 *       'Database configuration missing: either url or host is required'
 *     );
 *   }
 * }
 * ```
 *
 * @example
 * Connection testing and health checks
 * ```typescript
 * async function testDatabaseConnection(pool: Pool) {
 *   try {
 *     const client = await pool.connect();
 *     await client.query('SELECT 1');
 *     client.release();
 *   } catch (error) {
 *     throw new DatabaseConnectionError(
 *       `Database connection test failed: ${error.message}`
 *     );
 *   }
 * }
 * ```
 *
 * @example
 * Connection pool initialization
 * ```typescript
 * async function initializeDatabase(connectionString: string) {
 *   try {
 *     const pool = new Pool({ connectionString });
 *     await testConnection(pool);
 *     return drizzle(pool);
 *   } catch (error) {
 *     throw new DatabaseConnectionError(
 *       `Failed to initialize database connection: ${error.message}`
 *     );
 *   }
 * }
 * ```
 *
 * @example
 * Error handling in middleware
 * ```typescript
 * app.use(async (c, next) => {
 *   try {
 *     await next();
 *   } catch (error) {
 *     if (error instanceof DatabaseConnectionError) {
 *       return c.json({
 *         error: 'Service Unavailable',
 *         message: 'Database connection failed',
 *         details: error.message
 *       }, 503);
 *     }
 *     throw error;
 *   }
 * });
 * ```
 *
 * @example
 * Retry mechanism with exponential backoff
 * ```typescript
 * async function connectWithRetry(connectionString: string, maxRetries = 3) {
 *   for (let attempt = 1; attempt <= maxRetries; attempt++) {
 *     try {
 *       return await initializeDatabase(connectionString);
 *     } catch (error) {
 *       if (attempt === maxRetries) {
 *         throw new DatabaseConnectionError(
 *           `Database connection failed after ${maxRetries} attempts: ${error.message}`
 *         );
 *       }
 *
 *       const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
 *       await new Promise(resolve => setTimeout(resolve, delay));
 *     }
 *   }
 * }
 * ```
 */
export class ConnectionError extends ServiceUnavailableError {
  constructor(message = "Database connection failed") {
    super(message);

    this.name = "PostgresConnectionError";
  }
}
