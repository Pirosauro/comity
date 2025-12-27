import type { MigrationConfig } from "drizzle-orm/migrator";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";

export async function runMigrations(
  db: NodePgDatabase,
  config: MigrationConfig
) {
  await migrate(db, config);
}
