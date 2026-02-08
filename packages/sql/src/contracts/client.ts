import type { SqlQuery } from "./query.js";
import type { SqlOperationResult, SqlResult } from "./result.js";
import type { SqlTransaction } from "./transaction.js";

/**
 * SQL client boundary contract.
 *
 * @remarks
 * Executes SQL queries and starts transactions. Returns errors as data.
 * Implementations MUST be side-effect free except for actual SQL execution.
 */
export interface SqlClient {
  /**
   * Execute a SQL query.
   *
   * @typeParam T - Row shape produced by the query.
   *
   * @param query Immutable SQL query payload.
   *
   * @returns Operation result wrapping a SqlResult<T>.
   *
   * @throws Errors are not thrown; failures are returned via SqlOperationResult.
   *
   * @remarks
   * No implicit retries or logging at this boundary.
   */
  query<T>(query: Readonly<SqlQuery>): Promise<SqlOperationResult<SqlResult<T>>>;

  /**
   * Begin a new transaction.
   *
   * @returns Operation result wrapping a SqlTransaction capability.
   *
   * @throws Errors are not thrown; failures are returned via SqlOperationResult.
   *
   * @remarks
   * Nested transactions must be handled explicitly by implementations.
   */
  begin(): Promise<SqlOperationResult<SqlTransaction>>;
}
