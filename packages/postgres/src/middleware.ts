import { NodePgDatabase } from "drizzle-orm/node-postgres";
import type { Pool } from "pg";
import type {
  ApplicationContext,
  HonoMiddlewareHandler,
} from "@comity/application";
import type { LoggerModuleContext } from "@comity/logger";
import type {
  PostgresModuleEvents,
  PostgresModuleHonoContext,
  PostgresModuleOptions,
} from "./types.js";
import { env } from "hono/adapter";
import { Container } from "@comity/core/patterns";
import {
  createPool,
  performHealthCheck,
  testConnection,
} from "./utils/index.js";
import { DatabaseConnectionError } from "./errors/index.js";
import { withReplicas } from "drizzle-orm/pg-core";

/**
 * Creates a database middleware that provides PostgreSQL connection pooling and Drizzle ORM integration.
 *
 * This middleware:
 * - Establishes primary and replica database connections
 * - Configures connection pooling with health monitoring
 * - Provides Drizzle ORM instances for both primary and replica databases
 * - Supports repository pattern through dependency injection container
 * - Handles connection errors gracefully with retry mechanisms
 *
 * @param options - Configuration options for database connections and pooling
 * @param emit - Event emitter function for broadcasting database initialization events
 * @returns Hono middleware handler that sets up database context
 *
 * @example
 * ```typescript
 * const middleware = createDatabaseMiddleware({
 *   maxConnections: 20,
 *   connectionTimeout: 5000,
 *   replica: {
 *     maxConnections: 15
 *   }
 * }, emit);
 *
 * app.use(middleware);
 * ```
 */
export function createDatabaseMiddleware(
  options: PostgresModuleOptions = {},
  ctx: ApplicationContext & LoggerModuleContext
): HonoMiddlewareHandler<PostgresModuleHonoContext> {
  const logger = ctx.logger.child({ module: "@comity/postgres" });

  return async (c, next) => {
    const pools = {
      primary: null as
        | (NodePgDatabase<Record<string, never>> & {
            $client: Pool;
          })
        | null,
      replicas: [] as (NodePgDatabase<Record<string, never>> & {
        $client: Pool;
      })[],
    };

    try {
      const {
        HYPERDRIVE,
        HYPERDRIVE_REPLICAS,
        POSTGRES_URL,
        POSTGRES_URL_REPLICAS,
      } = env(c);

      // Validate database configuration
      if (!HYPERDRIVE?.connectionString && !POSTGRES_URL) {
        const message =
          "Database configuration missing: POSTGRES_URL or HYPERDRIVE connection string is required";

        logger.error(message);

        throw new DatabaseConnectionError(message);
      }

      // Create primary pool
      pools.primary = createPool(
        {
          connectionString: HYPERDRIVE?.connectionString || POSTGRES_URL,
          max: options?.maxConnections || 10,
          // Connection timeouts
          connectionTimeoutMillis: options?.connectionTimeout || 5000,
          idleTimeoutMillis: options?.idleTimeout || 300000,
          query_timeout: options?.queryTimeout || 30000,
          // Additional reliability settings
          allowExitOnIdle: true,
        },
        ctx
      );

      pools.replicas = [
        ...(HYPERDRIVE_REPLICAS || []).map(({ connectionString }) =>
          createPool(
            {
              connectionString,
              max: options?.replica?.maxConnections || 15,
              // Timeout configurations for replica
              connectionTimeoutMillis:
                options?.replica?.connectionTimeout || 5000,
              idleTimeoutMillis: options?.replica?.idleTimeout || 300000,
              query_timeout: options?.replica?.queryTimeout || 30000,
              allowExitOnIdle: true,
            },
            ctx
          )
        ),
        ...(POSTGRES_URL_REPLICAS || []).map((connectionString) =>
          createPool(
            {
              connectionString,
              max: options?.replica?.maxConnections || 15,
              // Timeout configurations for replica
              connectionTimeoutMillis:
                options?.replica?.connectionTimeout || 5000,
              idleTimeoutMillis: options?.replica?.idleTimeout || 300000,
              query_timeout: options?.replica?.queryTimeout || 30000,
              allowExitOnIdle: true,
            },
            ctx
          )
        ),
      ];

      // Test connections before proceeding
      if (!options?.skipConnectionTest) {
        await Promise.all([
          testConnection(pools.primary, "Primary"),
          ...pools.replicas.map((pool, index) =>
            testConnection(pool, `Replica ${index + 1}`)
          ),
        ]);
      }

      logger.debug("Database pools created successfully");

      const db = pools.replicas.length
        ? withReplicas(
            pools.primary,
            pools.replicas as [
              NodePgDatabase<Record<string, never>> & { $client: Pool }
            ]
          )
        : pools.primary;
      const repositories = new Container();

      // Emit initialization event
      await ctx.emit<PostgresModuleEvents["@comity/postgres:initialized"]>(
        "@comity/postgres:initialized",
        {
          db,
          registerRepository: (key, repository) => {
            repositories.register(key, () => new repository(db, logger));
          },
          healthCheck: async () => {
            // If health checks are disabled, return unknown status
            if (options?.disableHealthCheck) {
              return {
                status: "unknown",
                timestamp: new Date().toISOString(),
              };
            }

            return performHealthCheck(pools.primary!, pools.replicas);
          },
        }
      );

      // Set the database context
      c.set("postgres", repositories);
    } catch (error) {
      const message =
        error && error instanceof Error ? error.message : "Unknown error";

      // Log the error for debugging
      logger.error({ error }, `Database middleware error: ${message}`);

      // Clean up pools on error
      if (pools.primary) {
        try {
          await pools.primary.$client.end();
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "Unknown error";

          logger.error({ error }, `Error cleaning up primary pool: ${message}`);
          ctx.emit<PostgresModuleEvents["@comity/postgres:error"]>(
            "@comity/postgres:error",
            { error, client: null }
          );
        }
      }

      if (pools.replicas && pools.replicas.length) {
        try {
          await Promise.all(pools.replicas.map((pool) => pool.$client.end()));
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "Unknown error";

          logger.error({ error }, `Error cleaning up replica pool: ${message}`);
          ctx.emit<PostgresModuleEvents["@comity/postgres:error"]>(
            "@comity/postgres:error",
            { error, client: null }
          );
        }
      }

      // Throw a DatabaseConnectionError if it's not already one
      if (error instanceof DatabaseConnectionError) {
        throw error;
      } else {
        throw new DatabaseConnectionError(
          `Database initialization failed: ${message}`
        );
      }
    }

    return next();
  };
}
