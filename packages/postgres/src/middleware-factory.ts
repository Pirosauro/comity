import type { Pool } from "pg";
import type {
  ApplicationContext,
  HonoMiddlewareHandler,
} from "@comity/application";
import type { LoggerModuleContext } from "@comity/logger";
import type {
  PostgresClient,
  PostgresModuleEvents,
  PostgresModuleHonoContext,
  PostgresModuleHooks,
  PostgresModuleOptions,
  PostgresService,
} from "./types.js";
import { env } from "hono/adapter";
import { drizzle } from "drizzle-orm/node-postgres";
import { withReplicas } from "drizzle-orm/pg-core";
import { Container } from "@comity/core/patterns";
import { Client } from "./client.js";
import { performHealthCheck, testConnection } from "./utils/index.js";
import { ConnectionError } from "./errors/index.js";

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

        throw new ConnectionError(message);
      }

      // Create primary pool
      const primary = drizzle({
        client: new Client(
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
        ) as Pool,
      });
      const replicas = [
        ...(HYPERDRIVE_REPLICAS || []).map(({ connectionString }) =>
          drizzle({
            client: new Client(
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
            ) as Pool,
          })
        ),
        ...(POSTGRES_URL_REPLICAS || []).map((connectionString) =>
          drizzle({
            client: new Client(
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
            ) as Pool,
          })
        ),
      ];

      // Test connections before proceeding
      if (!options?.skipConnectionTest) {
        await Promise.all([
          testConnection(primary, "Primary"),
          ...replicas.map((pool, index) =>
            testConnection(pool, `Replica ${index + 1}`)
          ),
        ]);
      }

      const db = replicas.length
        ? withReplicas(primary, replicas as [PostgresClient])
        : primary;
      const repositories = new Container();
      const service: PostgresService = {
        select: db.select.bind(db),
        insert: db.insert.bind(db),
        update: db.update.bind(db),
        delete: db.delete.bind(db),
        transaction: db.transaction.bind(db),
        execute: db.execute?.bind(db),
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

          return performHealthCheck(primary, replicas);
        },
      };

      ctx.onHook("@comity/postgres:shutdown", async () => {
        if (primary) {
          try {
            await primary.$client.end();
          } catch (error) {
            const message =
              error instanceof Error ? error.message : "Unknown error";

            logger.error(
              { error },
              `Error cleaning up primary pool: ${message}`
            );
            ctx.emit<PostgresModuleEvents["@comity/postgres:error"]>(
              "@comity/postgres:error",
              { error, client: null }
            );
          }
        }

        if (replicas && replicas.length) {
          try {
            await Promise.all(replicas.map(({ $client }) => $client.end()));
          } catch (error) {
            const message =
              error instanceof Error ? error.message : "Unknown error";

            logger.error(
              { error },
              `Error cleaning up replica pool: ${message}`
            );
            ctx.emit<PostgresModuleEvents["@comity/postgres:error"]>(
              "@comity/postgres:error",
              { error, client: null }
            );
          }
        }
      });

      // Emit initialization event
      await ctx.emit<PostgresModuleHooks["@comity/postgres:initialized"]>(
        "@comity/postgres:initialized",
        service
      );

      // Set the database context
      c.set("postgres", service);
    } catch (error) {
      const message =
        error && error instanceof Error ? error.message : "Unknown error";

      // Log the error for debugging
      logger.error({ error }, `Database middleware error: ${message}`);

      await ctx.trigger<PostgresModuleHooks["@comity/postgres:shutodown"]>(
        "@comity/postgres:shutodown",
        message
      );

      // Throw a ConnectionError if it's not already one
      if (error instanceof ConnectionError) {
        throw error;
      } else {
        throw new ConnectionError(`Database initialization failed: ${message}`);
      }
    }

    return next();
  };
}
