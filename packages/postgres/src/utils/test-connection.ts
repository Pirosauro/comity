import type { Pool } from "pg";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { DatabaseConnectionError } from "../errors/index.js";

/**
 * Tests database connection health by attempting to connect and run a simple query
 *
 * @param pool - PostgreSQL connection pool to test
 * @param name - Pool name for error reporting
 * @throws Error if connection test fails
 *
 * @example
 * ```typescript
 * try {
 *   await testConnection(pool, "primary");
 *   console.log("Connection test passed");
 * } catch (error) {
 *   console.error("Connection test failed:", error.message);
 * }
 * ```
 */
export async function testConnection(
  db: NodePgDatabase & { $client: Pool },
  name: string
): Promise<void> {
  try {
    const client = await db.$client.connect();

    try {
      await client.query("SELECT 1");
    } finally {
      client.release();
    }
  } catch (error) {
    const message =
      error && error instanceof Error ? error.message : "Unknown error";

    throw new DatabaseConnectionError(
      `${name} database connection test failed: ${message}`
    );
  }
}
