import type { ResultFailure, ResultSuccess } from "@comity/primitives/result";
import type { SqlError } from "../errors/error.js";

/**
 * Result set for a SQL query.
 *
 * @typeParam T - Row shape produced by the query.
 *
 * @remarks
 * Immutable result representation. Contains rows and optional row count.
 */
export type SqlResult<T> = Readonly<{
  /**
   * Rows returned by the query.
   */
  rows: readonly T[];
  /**
   * Optional number of rows affected/returned.
   */
  rowCount?: number;
}>;

/**
 * Successful operation envelope.
 *
 * @typeParam T - Value produced by the operation.
 *
 * @remarks
 * Used to wrap successful results for explicit control flow.
 */
export type SqlOperationSuccess<T> = ResultSuccess<T>;

/**
 * Failed operation envelope.
 *
 * @remarks
 * Contains a structured error instead of throwing exceptions.
 */
export type SqlOperationFailure = ResultFailure<SqlError>;

/**
 * Explicit operation result union.
 *
 * @typeParam T - Value produced by the operation.
 *
 * @remarks
 * Prefer exhaustive handling across both success and failure branches.
 */
export type SqlOperationResult<T> = SqlOperationSuccess<T> | SqlOperationFailure;
