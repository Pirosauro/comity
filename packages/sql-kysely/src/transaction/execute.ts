import type { SqlOperationResult, SqlTransaction } from "@comity/sql";
import type { Kysely } from "kysely";

import { mapSqlError } from "../internal/map-sql-error.js";
import { executeQuery } from "../query/execute.js";

/**
 * Begin a transaction via Kysely and return a transactional capability.
 *
 * @typeParam DB - Database shape used by Kysely
 *
 * @param db - Kysely database instance
 * @param adapter - Adapter name for diagnostics
 *
 * @returns Operation result wrapping a SqlTransaction capability
 *
 * @throws Errors are not thrown; failures are returned via SqlOperationResult
 */
export async function executeTransaction<DB>(
  db: Kysely<DB>,
  adapter: string
): Promise<SqlOperationResult<SqlTransaction>> {
  try {
    let trx!: Kysely<DB>;
    let resolve!: () => void;
    let reject!: (e?: unknown) => void;

    const barrier = new Promise<void>((res, rej) => {
      resolve = res;
      reject = rej;
    });

    const txPromise = db.transaction().execute(async (t) => {
      trx = t;
      await barrier;
    });

    const transaction: SqlTransaction = {
      /** @inheritdoc */
      query: (q) => executeQuery(trx, q, adapter),

      /** @inheritdoc */
      commit: async () => {
        try {
          resolve();
          await txPromise;

          return { success: true, value: undefined };
        } catch (e) {
          return { success: false, error: mapSqlError(e, "transaction", adapter) };
        }
      },

      /** @inheritdoc */
      rollback: async () => {
        try {
          reject(new Error("rollback"));
          await txPromise.catch(() => {});

          return { success: true, value: undefined };
        } catch (e) {
          return { success: false, error: mapSqlError(e, "transaction", adapter) };
        }
      },
    };

    return {
      success: true,
      value: transaction,
    };
  } catch (e) {
    return { success: false, error: mapSqlError(e, "transaction", adapter) };
  }
}
