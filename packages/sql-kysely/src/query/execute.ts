import type { SqlOperationResult, SqlQuery, SqlResult } from "@comity/sql";
import type { Kysely } from "kysely";

import { CompiledQuery } from "kysely";
import { KyselySqlError } from "../errors/kysely.js";
import { mapSqlError } from "../errors/map-sql-error.js";

/**
 * Validate query payload support for this adapter.
 *
 * @param query - Immutable SQL query payload
 *
 * @throws Error when named parameters are provided (unsupported)
 */
export function assertSupportedQuery(query: SqlQuery): void {
  if (query.params && !Array.isArray(query.params)) {
    throw new Error("Named parameters are not supported by Kysely adapter");
  }
}

/**
 * Execute a SQL query via Kysely and return an explicit operation result.
 *
 * @typeParam DB - Database shape used by Kysely
 * @typeParam T - Row shape produced by the query
 *
 * @param db - Kysely database instance
 * @param query - Immutable SQL query payload
 * @param adapter - Adapter name for diagnostics
 *
 * @returns Operation result wrapping a SqlResult<T>
 *
 * @throws Errors are not thrown; failures are returned via SqlOperationResult
 */
export async function executeQuery<DB, T>(
  db: Kysely<DB>,
  query: SqlQuery,
  adapter: string
): Promise<SqlOperationResult<SqlResult<T>>> {
  if (query.params && !Array.isArray(query.params)) {
    return {
      success: false,
      error: new KyselySqlError("Named parameters not supported", {
        reason: "invalid-query",
        retriable: false,
        adapter,
        operation: "query",
      }),
    };
  }

  try {
    const compiled = CompiledQuery.raw(query.statement, (query.params ?? []) as unknown[]);
    const result = await db.executeQuery(compiled);

    return {
      success: true,
      value: {
      rows: result.rows as readonly T[],
      rowCount:
        typeof result.numAffectedRows === "bigint"
          ? Number(result.numAffectedRows)
          : result.rows.length,
      },
    };
  } catch (e) {
    return {
      success: false,
      error: mapSqlError(e, "query", adapter),
    };
  }
}
