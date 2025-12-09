import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import type { Pool } from "pg";
import type { LoggerService } from "@comity/logger";

export type DatabaseRepositoryConstructor<T> = new (
  db: NodePgDatabase<Record<string, never>> & { $client: Pool },
  logger: LoggerService
) => T;

/**
 * Base class for database repositories.
 *
 * Provides a foundation for creating repositories that interact with
 * a PostgreSQL database using Drizzle ORM. Repositories extending this
 * class will have access to the database instance and the core logger.
 *
 * @remarks
 * This class is abstract and should be extended by specific repository
 * implementations. It encapsulates the database connection and logger,
 * promoting code reuse and consistency across different repositories.
 */
export abstract class DatabaseRepository {
  #db: NodePgDatabase<Record<string, never>> & { $client: Pool };
  #logger: LoggerService;

  constructor(
    db: NodePgDatabase<Record<string, never>> & {
      $client: Pool;
    },
    logger: LoggerService
  ) {
    this.#db = db;
    this.#logger = logger;
  }

  /**
   * Gets the Drizzle ORM database instance.
   *
   * @returns The Drizzle ORM database instance for executing queries.
   */
  protected get db() {
    return this.#db;
  }

  /**
   * Gets the logger context.
   *
   * @returns The logger context for logging within the repository.
   */
  protected get logger() {
    return this.#logger;
  }
}
