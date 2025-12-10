import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import type {
  Pool,
  PoolClient,
  QueryResult,
  QueryConfig,
  QueryConfigValues,
  QueryArrayResult,
} from "pg";
import type { LoggerService } from "@comity/logger";
import type { PostgresHealthCheck } from "./utils/types.js";

export type PostgresClient = NodePgDatabase<Record<string, never>> & {
  $client: Pool;
};

export type PostgresService = Pick<
  PostgresClient,
  "select" | "insert" | "update" | "delete" | "transaction" | "execute"
> & {
  /**
   * Helper function to register repositories in the container
   *
   * @param key - Unique identifier for the repository
   * @param repository - Repository class constructor
   */
  registerRepository: <T>(
    key: string,
    repository: new (
      db: NodePgDatabase<Record<string, never>> & {
        $client: Pool;
      },
      logger: LoggerService
    ) => T
  ) => void;

  /** Function to perform a health check on the databases */
  healthCheck: () => Promise<
    PostgresHealthCheck | Pick<PostgresHealthCheck, "status" | "timestamp">
  >;
};

/**
 * Options for setting up the database module.
 *
 * Provides configuration for PostgreSQL connection pooling, timeouts,
 * replica databases, performance monitoring, and migrations.
 */
export type PostgresModuleOptions = {
  /** Maximum number of connections in the primary pool (default: 10) */
  maxConnections?: number;

  /** Connection timeout in milliseconds (default: 5000) */
  connectionTimeout?: number;

  /** Idle connection timeout in milliseconds (default: 300000) */
  idleTimeout?: number;

  /** Query timeout in milliseconds (default: 30000) */
  queryTimeout?: number;

  /** Enable connection event logging (default: false) */
  logConnections?: boolean;

  // Replica settings
  replica?: {
    /** Maximum number of connections in the replica pool (default: 15) */
    maxConnections?: number;

    /** Replica connection timeout in milliseconds (default: 5000) */
    connectionTimeout?: number;

    /** Replica idle connection timeout in milliseconds (default: 300000) */
    idleTimeout?: number;

    /** Replica query timeout in milliseconds (default: 30000) */
    queryTimeout?: number;
  };

  /** Skip testing database connections on startup (default: false) */
  skipConnectionTest?: boolean;

  /** Disable health check (default: false) */
  disableHealthCheck?: boolean;
};

/**
 * Interface for the database middleware context.
 *
 * Defines the Hono context bindings and variables that are available
 * when the database middleware is active.
 */
export type PostgresModuleHonoContext = {
  Bindings: {
    /** Primary database connection URL */
    POSTGRES_URL?: string;

    /** Replica database connection URL */
    POSTGRES_URL_REPLICAS?: string[];

    /** Cloudflare Hyperdrive primary connection */
    HYPERDRIVE?: {
      connectionString: string;
    };

    /** Cloudflare Hyperdrive replica connection */
    HYPERDRIVE_REPLICAS?: {
      connectionString: string;
    }[];
  };
  Variables: {
    /** Database repositories */
    postgres: PostgresService;
  };
};

export type PostgresModuleHooks = {
  "@comity/postgres:initialized": PostgresService;

  "@comity/postgres:shutdown": string;
};

export type PostgresModuleEvents = {
  "@comity/postgres:error": {
    error: unknown;
    client: PoolClient | null;
  };

  "@comity/postgres:release": {
    error: unknown;
    client: PoolClient;
  };

  "@comity/postgres:connect": {
    client: PoolClient;
  };

  "@comity/postgres:acquire": {
    client: PoolClient;
  };

  "@comity/postgres:remove": {
    client: PoolClient;
  };

  "@comity/postgres:query-start": {
    id: string;
    query: QueryConfig<any> | string;
    params?: QueryConfigValues<any> | undefined;
  };

  "@comity/postgres:query-end": {
    id: string;
    result?: QueryResult<any> | QueryArrayResult<any> | undefined;
  };

  "@comity/postgres:query-error": {
    id: string;
    error: Error;
  };
};
