import type { PoolConfig } from "pg";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import type { ApplicationContext } from "@comity/application";
import type { LoggerModuleContext } from "@comity/logger";
import type { PostgresModuleEvents } from "../types.js";
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";

/**
 * Creates a PostgreSQL connection pool with enhanced error handling and monitoring
 *
 * @param connectionString - PostgreSQL connection string
 * @param poolOptions - Pool configuration options
 * @param name - Pool name for logging and identification
 * @param globalOptions - Global database module options for logging configuration
 * @returns Configured PostgreSQL connection pool
 *
 * @example
 * ```typescript
 * const pool = createPool(
 *   "postgresql://user:pass@localhost:5432/db",
 *   { maxConnections: 10, connectionTimeout: 5000 },
 *   "primary",
 *   { logConnections: true }
 * );
 * ```
 */
export function createPool(
  config: PoolConfig,
  ctx: ApplicationContext & LoggerModuleContext
): NodePgDatabase<Record<string, never>> & {
  $client: Pool;
} {
  const pool = new Pool(config);

  // Add error event handlers
  pool.on("error", (error, client) => {
    if (error) {
      const message = error instanceof Error ? error.message : "Unknown error";

      ctx.logger.error({ error }, `Database pool error: ${message}`);
    }

    ctx.emit<PostgresModuleEvents["@comity/postgres:error"]>(
      "@comity/postgres:error",
      { client, error }
    );
  });
  pool.on("release", (error, client) => {
    if (error) {
      const message = error instanceof Error ? error.message : "Unknown error";

      ctx.logger.error(
        { error },
        `Database pool release error: ${error.message}`
      );
    }

    ctx.emit<PostgresModuleEvents["@comity/postgres:release"]>(
      "@comity/postgres:release",
      { client, error }
    );
  });

  // Connection event handlers for monitoring
  pool.on("connect", (client) => {
    ctx.emit<PostgresModuleEvents["@comity/postgres:connect"]>(
      "@comity/postgres:connect",
      { client }
    );
  });
  pool.on("acquire", (client) => {
    ctx.emit<PostgresModuleEvents["@comity/postgres:acquire"]>(
      "@comity/postgres:acquire",
      { client }
    );
  });
  pool.on("remove", (client) => {
    ctx.emit<PostgresModuleEvents["@comity/postgres:remove"]>(
      "@comity/postgres:remove",
      { client }
    );
  });

  return drizzle({ client: pool });
}
