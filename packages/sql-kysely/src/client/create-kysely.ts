import type { SqlClient, SqlClientOptions } from "@comity/sql";
import type { Kysely } from "kysely";

import { executeQuery } from "../query/execute.js";
import { executeTransaction } from "../transaction/execute.js";

/**
 * Kysely client factory options.
 *
 * @typeParam DB - Database shape used by Kysely
 */
export interface KyselySqlClientOptions<DB> extends SqlClientOptions {
  /** Kysely database instance */
  readonly db: Kysely<DB>;

  /** Adapter name for diagnostics */
  readonly adapter: string;
}

/**
 * Create a SqlClient backed by a Kysely database instance.
 *
 * @typeParam DB - Database shape used by Kysely
 *
 * @param options - Immutable client configuration including db and adapter name
 *
 * @returns SqlClient implementation that executes queries and transactions via Kysely
 *
 * @throws Errors are not thrown; failures are returned via SqlOperationResult
 *
 * @remarks
 * - Public API does not expose Kysely types
 * - Error reasons use kebab-case domain format (sql:<error-kind>)
 */
export function createKyselySqlClient<DB = unknown>(
  options: KyselySqlClientOptions<DB>
): SqlClient {
  return {
    /** @inheritdoc  */
    query: (q) => executeQuery(options.db, q, options.adapter),

    /** @inheritdoc */
    begin: () => executeTransaction(options.db, options.adapter),
  };
}
