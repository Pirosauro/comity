import type { KyselyDatabase } from "../client/types.js";

import { SqlError } from "@comity/sql/errors";

/**
 * Assert the provided client is a Kysely-like database with required methods.
 */
type MaybeKyselyDatabase = {
  /** */
  executeQuery: unknown;

  /** */
  transaction: unknown;
};

/**
 * Validate the client shape and throw a structured error if invalid.
 *
 * @param client - Value to validate as KyselyDatabase
 *
 * @throws KyselySqlError with reason "sql:connection_failed" if invalid
 */
export function assertKyselyClient(client: unknown): asserts client is KyselyDatabase {
  if (
    !client ||
    typeof client !== "object" ||
    typeof (client as MaybeKyselyDatabase).executeQuery !== "function" ||
    typeof (client as MaybeKyselyDatabase).transaction !== "function"
  ) {
    throw new SqlError("connection_failed", {
      details: { retriable: false },
    });
  }
}
