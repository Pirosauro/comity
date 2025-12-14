import type {
  PoolConfig,
  QueryResult,
  QueryConfig,
  QueryConfigValues,
  Submittable,
} from "pg";
import type { LoggerModuleContext } from "@comity/logger";
import type { ApplicationContext } from "@comity/application";
import type { PostgresModuleEvents } from "./types.js";
import { Pool } from "pg";

/**
 * Extended PostgreSQL connection pool client with event monitoring and query tracking.
 *
 * @remarks
 * This class extends the native `pg.Pool` to provide additional functionality:
 * - Automatic event emission for connection lifecycle events
 * - Query execution tracking with start/end/error events
 * - Integration with Comity's logging and event system
 * - Enhanced error handling and monitoring
 *
 * **Event Types Emitted:**
 * - `connect`: When a client connects to the database
 * - `acquire`: When a client is acquired from the pool
 * - `release`: When a client is released back to the pool
 * - `remove`: When a client is removed from the pool
 * - `error`: When a pool-level error occurs
 * - `query-start`: When a query execution begins
 * - `query-end`: When a query execution completes successfully
 * - `query-error`: When a query execution fails
 *
 * All events are forwarded to the Comity event system for centralized monitoring.
 *
 * @example
 * Basic client usage with event handling
 * ```typescript
 * const client = new Client({
 *   connectionString: "postgresql://localhost:5432/mydb",
 *   max: 10
 * }, context);
 *
 * // Client automatically emits events through the context
 * ```
 */
export class Client extends Pool {
  constructor(
    config: PoolConfig,
    ctx: ApplicationContext & LoggerModuleContext
  ) {
    super(config);

    // Add error event handlers
    this.on("error", (error, client) => {
      if (error) {
        const message =
          error instanceof Error ? error.message : "Unknown error";

        ctx.logger.error({ error }, `Database pool error: ${message}`);
      }

      ctx.emit<PostgresModuleEvents["@comity/postgres:error"]>(
        "@comity/postgres:error",
        { client, error }
      );
    });

    // Release event handlers for monitoring
    this.on("release", (error, client) => {
      if (error) {
        const message =
          error instanceof Error ? error.message : "Unknown error";

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
    this.on("connect", (client) => {
      ctx.emit<PostgresModuleEvents["@comity/postgres:connect"]>(
        "@comity/postgres:connect",
        { client }
      );
    });

    // Acquire event handlers for monitoring
    this.on("acquire", (client) => {
      ctx.emit<PostgresModuleEvents["@comity/postgres:acquire"]>(
        "@comity/postgres:acquire",
        { client }
      );
    });

    // Remove event handlers for monitoring
    this.on("remove", (client) => {
      ctx.emit<PostgresModuleEvents["@comity/postgres:remove"]>(
        "@comity/postgres:remove",
        { client }
      );
    });

    // Query event handlers for monitoring
    // @ts-expect-error
    this.on("query-start", (payload) => {
      ctx.emit<PostgresModuleEvents["@comity/postgres:query-start"]>(
        "@comity/postgres:query-start",
        payload
      );
    });

    // @ts-expect-error
    this.on("query-end", (payload) => {
      ctx.emit<PostgresModuleEvents["@comity/postgres:query-end"]>(
        "@comity/postgres:query-end",
        payload
      );
    });

    // @ts-expect-error
    this.on("query-error", (payload) => {
      ctx.emit<PostgresModuleEvents["@comity/postgres:query-error"]>(
        "@comity/postgres:query-error",
        payload
      );
    });
  }

  /**
   * Executes a database query with event tracking.
   *
   * @remarks
   * This method overrides the base Pool.query to add query lifecycle event emission.
   * It emits `query-start`, `query-end`, and `query-error` events through the Comity event system.
   *
   * @param query - SQL query string or query configuration object
   * @param params - Query parameters for parameterized queries
   * @param callback - Optional callback function (not recommended for async/await)
   * @returns Promise resolving to query result or void if callback is provided
   *
   * @template T - The type of the query result
   */
  // @ts-expect-error
  async query<T extends Submittable>(
    query: QueryConfig<any[]> | string,
    params?: QueryConfigValues<any>,
    callback?: (err: Error, result: QueryResult<T>) => void
  ): Promise<void | QueryResult<T>> {
    const id = Math.random().toString(36).substring(2, 15);
    const timestamp = Date.now();

    // Emit query-start event
    this.emit("query-start", {
      id,
      query,
      params,
      timestamp,
    });

    try {
      const result = await super.query(query as string, params, callback!);

      // Emit query-end event
      this.emit("query-end", {
        id,
        result,
        timestamp,
        duration: Date.now() - timestamp,
      });

      return result;
    } catch (error) {
      // Emit query-error event
      this.emit("query-error", {
        id,
        error,
        timestamp,
        duration: Date.now() - timestamp,
      });

      // Rethrow the error for upstream handling
      throw error;
    }
  }
}
