import type { Compilable } from "kysely";

/**
 * Minimal Kysely database interface used by this adapter.
 */
export interface KyselyDatabase {
  /** Execute a compiled query and return rows with optional affected count */
  executeQuery<T = unknown>(
    query: Compilable
  ): Promise<{
    /** Result rows */
    rows: T[];

    /** Optional affected rows count as bigint */
    numAffectedRows?: bigint;
  }>;

  /** Start a transaction and execute the provided function within it */
  transaction(): {
    /** Execute transactional work and resolve with the function's result */
    execute<T>(fn: (trx: KyselyDatabase) => Promise<T>): Promise<T>;
  };
}
