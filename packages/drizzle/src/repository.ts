import type { DrizzleAlikeQueryBuilder } from "./types.js";

/**
 * Base class for database repositories.
 */
export abstract class Repository<DB> {
  #db: DB;

  constructor(db: DB) {
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

  protected paginate<T>(
    query: Pick<DrizzleAlikeQueryBuilder, "limit" | "offset">,
    page = 1,
    limit = 100
  ) {
    return query.offset((page - 1) * limit).limit(limit);
  }

  protected normalizeArray<T>(data: T | T[]): T[] {
    return Array.isArray(data) ? data : [data];
  }
}
