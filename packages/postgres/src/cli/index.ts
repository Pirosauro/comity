import type { CliPlugin } from "@comity/cli";
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { runMigrations } from "./commands/migrate.js";

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
      name: "postgres:migrate",
      description: "Migrate database schema",
      options: [
        {
          flags: "-f, --folder <migrationsFolder>",
          description: "Migrations folder",
          default: "migrations",
        },
        {
          flags: "-t, --timeout <ms>",
          description: "Connection timeout in milliseconds",
          default: "5000",
        },
      ],
      action: async (options: { folder: string; timeout: string }) => {
        try {
          if (!process.env.POSTGRES_URL && !process.env.VITE_POSTGRES_URL) {
            console.error("❌ No database connection string provided.");
            process.exit(1);
          }

          console.log("Connecting to the database...");

          const pool = new Pool({
            connectionString:
              process.env.POSTGRES_URL || process.env.VITE_POSTGRES_URL,
            connectionTimeoutMillis: parseInt(options.timeout),
            query_timeout: 10000,
          });
          const db = drizzle({ client: pool });

          await runMigrations(db, {
            migrationsFolder: options.folder,
          });

          await pool.end();

          console.log("✅ Database migration completed successfully!");
          process.exit(0);
        } catch (error) {
          console.error("❌ An error occurred during migration.");
          console.error(
            `   ${error instanceof Error ? error.message : String(error)}`
          );
          process.exit(1);
        }
      },
    },
  ],
  hooks: {
    beforeCommand: (context) => {
      // if (context.command.startsWith("postgres:")) {
      //   console.log(`🔧 PostgreSQL CLI - Executing: ${context.command}`);
      // }
    },
    afterCommand: (context) => {
      // if (context.command.startsWith("postgres:")) {
      //   console.log("✨ Command completed.");
      // }
    },
  },
};

export default plugin;
