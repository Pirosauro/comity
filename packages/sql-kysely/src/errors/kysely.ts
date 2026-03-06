import { SqlError } from "@comity/sql/errors";

/**
 *
 */
export class KyselySqlError extends SqlError {
  readonly code = "sql:kysely-adapter";
}
