/**
 * SQL query payload.
 *
 * @remarks
 * `params` may be positional or named.
 * Support for named parameters is adapter-specific.
 * Applications should not assume universal support.
 *
 * @example
 * const q: SqlQuery = { statement: "SELECT * FROM users WHERE id = $1", params: ["u_123"] };
 */
export type SqlQuery =
  | Readonly<{
      /** SQL statement. */
      statement: string;

      /** Positional parameters for the statement. */
      params?: readonly unknown[];
    }>
  | Readonly<{
      /** SQL statement. */
      statement: string;

      /** Named parameters for the statement. */
      params?: Record<string, unknown>;
    }>;
