import type { CliPlugin } from "@comity/cli";
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { testConnection } from "../utils/test-connection.js";
import { performHealthCheck } from "../utils/health-check.js";

/**
 * Simple logger interface for CLI operations
 */
interface SimpleLogger {
  info: (message: string, ...args: any[]) => void;
  error: (message: string, ...args: any[]) => void;
  warn: (message: string, ...args: any[]) => void;
  debug: (message: string, ...args: any[]) => void;
  fatal: (message: string, ...args: any[]) => void;
  trace: (message: string, ...args: any[]) => void;
  silent: (message: string, ...args: any[]) => void;
  child: (bindings: Record<string, any>) => SimpleLogger;
}

/**
 * PostgreSQL CLI plugin for Comity framework.
 *
 * Provides database management commands for PostgreSQL operations including
 * connection testing, health checks, and database introspection.
 */
const plugin: CliPlugin = {
  name: "@comity/postgres",
  version: "1.0.0",
  commands: [
    {
      name: "db:test-connection [url]",
      description: "Test database connection",
      options: [
        {
          flags: "-t, --timeout <ms>",
          description: "Connection timeout in milliseconds",
          default: "5000",
        },
      ],
      action: async (url: string | undefined, options: { timeout: string }) => {
        const logger: SimpleLogger = {
          info: console.log,
          error: console.error,
          warn: console.warn,
          debug: console.debug,
          fatal: console.error,
          trace: console.debug,
          silent: () => {},
          child: () => logger,
        };

        try {
          const connectionString =
            url || process.env.POSTGRES_URL || process.env.DATABASE_URL;

          if (!connectionString) {
            console.error("❌ No database connection string provided.");
            console.error(
              "   Set POSTGRES_URL or DATABASE_URL environment variable,"
            );
            console.error(
              "   or provide URL as argument: comity postgres db:test-connection <url>"
            );
            process.exit(1);
          }

          console.log("🔍 Testing database connection...");
          console.log(
            `   URL: ${connectionString.replace(/:[^:]+@/, ":***@")}`
          );

          const pool = new Pool({
            connectionString,
            connectionTimeoutMillis: parseInt(options.timeout),
            query_timeout: 10000,
          });
          const db = drizzle(pool);

          await testConnection(db, "CLI Test");

          console.log("✅ Database connection successful!");
          console.log("   Connection established and tested.");

          await pool.end();
          process.exit(0);
        } catch (error) {
          console.error("❌ Database connection failed!");
          console.error(
            `   Error: ${
              error instanceof Error ? error.message : String(error)
            }`
          );
          process.exit(1);
        }
      },
    },
    {
      name: "db:health-check [url]",
      description: "Perform database health check",
      options: [
        {
          flags: "-t, --timeout <ms>",
          description: "Connection timeout in milliseconds",
          default: "5000",
        },
        {
          flags: "--replicas <urls>",
          description: "Comma-separated replica URLs",
        },
      ],
      action: async (
        url: string | undefined,
        options: { timeout: string; replicas?: string }
      ) => {
        const logger: SimpleLogger = {
          info: console.log,
          error: console.error,
          warn: console.warn,
          debug: console.debug,
          fatal: console.error,
          trace: console.debug,
          silent: () => {},
          child: () => logger,
        };

        try {
          const primaryUrl =
            url || process.env.POSTGRES_URL || process.env.DATABASE_URL;

          if (!primaryUrl) {
            console.error("❌ No primary database connection string provided.");
            process.exit(1);
          }

          console.log("🏥 Performing database health check...");

          const primaryPool = new Pool({
            connectionString: primaryUrl,
            connectionTimeoutMillis: parseInt(options.timeout),
            query_timeout: 10000,
          });
          const primary = drizzle(primaryPool);

          const replicaPools = options.replicas
            ? options.replicas.split(",").map(
                (url) =>
                  new Pool({
                    connectionString: url.trim(),
                    connectionTimeoutMillis: parseInt(options.timeout),
                    query_timeout: 10000,
                  })
              )
            : [];
          const replicas = replicaPools.map((pool) => drizzle(pool));

          const health = await performHealthCheck(primary, replicas);

          console.log(`📊 Health Status: ${health.status.toUpperCase()}`);
          console.log(`   Timestamp: ${health.timestamp}`);
          console.log(
            `   Primary: ${health.primary.status} (${
              health.primary.latency || "N/A"
            }ms)`
          );

          if (health.replicas && health.replicas.length > 0) {
            health.replicas.forEach((replica, index) => {
              console.log(
                `   Replica ${index + 1}: ${replica.status} (${
                  replica.latency || "N/A"
                }ms)`
              );
            });
          }

          if (health.poolStats) {
            console.log("   Pool Statistics:");
            console.log(
              `     Primary - Total: ${health.poolStats.primary.total}, Idle: ${health.poolStats.primary.idle}, Waiting: ${health.poolStats.primary.waiting}`
            );

            if (
              health.poolStats.replicas &&
              health.poolStats.replicas.length > 0
            ) {
              health.poolStats.replicas.forEach((stats, index) => {
                console.log(
                  `     Replica ${index + 1} - Total: ${stats.total}, Idle: ${
                    stats.idle
                  }, Waiting: ${stats.waiting}`
                );
              });
            }
          }

          await primaryPool.end();
          for (const pool of replicaPools) {
            await pool.end();
          }

          const exitCode =
            health.status === "healthy"
              ? 0
              : health.status === "degraded"
              ? 1
              : 2;
          process.exit(exitCode);
        } catch (error) {
          console.error("❌ Health check failed!");
          console.error(
            `   Error: ${
              error instanceof Error ? error.message : String(error)
            }`
          );
          process.exit(1);
        }
      },
    },
    {
      name: "db:info [url]",
      description: "Show database information",
      options: [
        {
          flags: "-t, --timeout <ms>",
          description: "Connection timeout in milliseconds",
          default: "5000",
        },
      ],
      action: async (url: string | undefined, options: { timeout: string }) => {
        const logger: SimpleLogger = {
          info: console.log,
          error: console.error,
          warn: console.warn,
          debug: console.debug,
          fatal: console.error,
          trace: console.debug,
          silent: () => {},
          child: () => logger,
        };

        try {
          const connectionString =
            url || process.env.POSTGRES_URL || process.env.DATABASE_URL;

          if (!connectionString) {
            console.error("❌ No database connection string provided.");
            process.exit(1);
          }

          console.log("📋 Gathering database information...");

          const pool = new Pool({
            connectionString,
            connectionTimeoutMillis: parseInt(options.timeout),
            query_timeout: 10000,
          });
          const db = drizzle(pool);

          const client = await pool.connect();

          try {
            // Get PostgreSQL version
            const versionResult = await client.query("SELECT version()");
            const version = versionResult.rows[0].version;

            // Get database name
            const dbResult = await client.query("SELECT current_database()");
            const database = dbResult.rows[0].current_database;

            // Get user
            const userResult = await client.query("SELECT current_user");
            const user = userResult.rows[0].current_user;

            // Get connection info
            const connectionResult = await client.query(`
              SELECT
                inet_server_addr() as server_addr,
                inet_server_port() as server_port,
                pg_postmaster_start_time() as start_time
            `);
            const connection = connectionResult.rows[0];

            console.log("🗄️  Database Information:");
            console.log(`   Database: ${database}`);
            console.log(`   User: ${user}`);
            console.log(
              `   Server: ${connection.server_addr || "localhost"}:${
                connection.server_port || "5432"
              }`
            );
            console.log(`   PostgreSQL: ${version.split(" ")[1]}`);
            console.log(`   Started: ${connection.start_time}`);

            // Get table count
            const tableResult = await client.query(`
              SELECT count(*) as table_count
              FROM information_schema.tables
              WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
            `);
            const tableCount = tableResult.rows[0].table_count;

            console.log(`   Tables: ${tableCount}`);
          } finally {
            client.release();
            await pool.end();
          }

          console.log("✅ Database information retrieved successfully!");
          process.exit(0);
        } catch (error) {
          console.error("❌ Failed to retrieve database information!");
          console.error(
            `   Error: ${
              error instanceof Error ? error.message : String(error)
            }`
          );
          process.exit(1);
        }
      },
    },
  ],
  hooks: {
    beforeCommand: (context) => {
      if (context.command.startsWith("db:")) {
        console.log(`🔧 PostgreSQL CLI - Executing: ${context.command}`);
      }
    },
    afterCommand: (context) => {
      if (context.command.startsWith("db:")) {
        console.log("✨ Command completed.");
      }
    },
  },
};

export default plugin;
