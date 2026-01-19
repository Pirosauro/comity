import type { ErrorMeta } from "@comity/core/errors";

import { BaseError } from "@comity/core/errors";

/**
 * Metadata for an AssuranceRequiredError
 */
export interface AssuranceRequiredErrorMeta extends ErrorMeta {
  /** Reason for the assurance requirement */
  reason: string;

  /** The policy that required the assurance */
  policy: string;
}

/**
 * Thrown when a session does not meet the required assurance level.
 */
export class AssuranceRequiredError extends BaseError {
  readonly code = "auth:assurance_required";

  constructor(meta?: AssuranceRequiredErrorMeta) {
    super("Higher assurance required", {
      httpStatus: 403,
      ...meta,
    });
  }
}
