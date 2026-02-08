import type { SqlErrorMeta } from "./types.js";

import { BaseError } from "@comity/primitives/errors";

/**
 * Base class for SQL-related errors.
 *
 * @remarks
 * The error message is non-canonical and intended for diagnostics only.
 * Consumers must rely on `meta.reason` for logic.
 */
export abstract class SqlError extends BaseError {
  /**
   * @param message - Human-readable error message for diagnostics
   * @param meta - Error metadata including canonical reason and diagnostics
   */
  constructor(message: string, meta: SqlErrorMeta) {
    super(message, meta);
  }
}
