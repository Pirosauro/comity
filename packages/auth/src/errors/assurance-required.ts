import type { ErrorMeta } from "@comity/primitives/errors";

import { BaseError } from "@comity/primitives/errors";

/**
 * Metadata for an AssuranceRequiredError.
 */
export interface AssuranceRequiredErrorMeta extends ErrorMeta {
  /** Reason for the assurance requirement */
  reason: string;

  /** Policy that required the assurance */
  policy: string;
}

/**
 * Thrown when a session does not meet the required assurance level.
 */
export class AssuranceRequiredError extends BaseError {
  readonly code = "auth:assurance_required";

  /**
   * @param meta - Optional metadata describing the assurance requirement
   */
  constructor(meta?: AssuranceRequiredErrorMeta) {
    super("Higher assurance required", {
      httpStatus: 403,
      ...meta,
    });
  }
}
