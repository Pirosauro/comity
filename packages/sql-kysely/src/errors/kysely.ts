import { SqlError } from "@comity/sql/errors";

/**
 * Adapter-specific SqlError used to tag failures originating from Kysely engine.
 *
 * @remarks
 * Consumers must rely on `meta.reason` for logic; message is diagnostic only.
 */
export class KyselySqlError extends SqlError {
  readonly code = "sql:kysely-adapter";
}
