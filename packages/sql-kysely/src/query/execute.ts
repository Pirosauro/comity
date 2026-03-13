import type { SqlOperationResult, SqlQuery, SqlResult } from "@comity/sql";
import type { Kysely } from "kysely";

import { SqlError } from "@comity/sql/error";
import { CompiledQuery } from "kysely";
import { mapSqlError } from "../internal/map-sql-error.js";

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
      error: new SqlError("invalid_query", {
        details: {
          retriable: false,
          adapter,
          operation: "query",
        },
        context: {
          violation: "named_parameters",
        },
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
