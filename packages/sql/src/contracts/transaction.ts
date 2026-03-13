import type { SqlQuery } from "./query.js";
import type { SqlOperationResult, SqlResult } from "./result.js";

/**
 * Transaction capability.
 *
 * @remarks
 * Provides explicit transactional boundaries. Errors are returned as data.
 */
export interface SqlTransaction {
  /**
   * Execute a SQL query within the transaction.
   *
   * @typeParam T - Row shape produced by the query.
   *
   * @param query Immutable SQL query payload.
   *
   * @returns Operation result wrapping a SqlResult<T>.
   *
   * @throws Errors are not thrown; failures are returned via SqlOperationResult.
   */
  query<T>(query: Readonly<SqlQuery>): Promise<SqlOperationResult<SqlResult<T>>>;

  /**
   * Commit the transaction.
   *
   * @returns Operation result indicating commit outcome.
   *
   * @throws Errors are not thrown; failures are returned via SqlOperationResult.
   */
  commit(): Promise<SqlOperationResult<void>>;

  /**
   * Roll back the transaction.
   *
   * @returns Operation result indicating rollback outcome.
   *
   * @throws Errors are not thrown; failures are returned via SqlOperationResult.
   */
  rollback(): Promise<SqlOperationResult<void>>;
}
