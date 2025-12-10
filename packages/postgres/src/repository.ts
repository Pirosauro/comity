import type { PostgresService } from "./types.js";

export type PostgresRepositoryConstructor<T> = new (db: PostgresService) => T;

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
export abstract class PostgresRepository {
  #db: PostgresService;

  constructor(db: PostgresService) {
    this.#db = db;
  }

  /**
   * Gets the Drizzle ORM database instance.
   *
   * @returns The Drizzle ORM database instance for executing queries.
   */
  protected get db() {
    return this.#db;
  }
}
