import type { ErrorMeta } from "@comity/primitives/errors";

import { BaseError } from "@comity/primitives/errors";

/**
 * Metadata for an InvalidSessionError.
 *
 * @typeParam T - Specific reason literal type for the invalid session
 */
export interface InvalidSessionErrorMeta<T extends string> extends ErrorMeta {
  /** Reason for the session invalidity */
  reason?: T | undefined;
}

/**
 * Thrown when a session is invalid.
 *
 * @typeParam T - Specific reason literal type for the invalid session
 */
export class InvalidSessionError<T extends string> extends BaseError {
  readonly code = "auth:session_invalid";

  /**
   * @param meta - Optional error metadata
   */
  constructor(meta?: InvalidSessionErrorMeta<T>) {
    super("Invalid session", {
      httpStatus: 401,
      ...meta,
    });
  }
}
