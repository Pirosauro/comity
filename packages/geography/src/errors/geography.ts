import type { ErrorMeta } from "@comity/primitives/errors";

import { BaseError } from "@comity/primitives/errors";

/**
 * Reasons for geography errors.
 */
export type GeographyErrorReason = "resolution_failed";

/**
 * Stable default messages for each reason.
 */
const REASON_MESSAGES: Record<GeographyErrorReason, string> = {
  resolution_failed: "Geographic resolution failed",
};

/**
 * Geography Error.
 *
 * @remarks
 * Represents failures in geographic operations such as resolving country
 * or subdivision metadata, validating postal codes, or interpreting
 * geographic identifiers.
 */
export class GeographyError extends BaseError {
  readonly code: `geography:${GeographyErrorReason}`;

  constructor(reason: GeographyErrorReason, meta?: ErrorMeta) {
    super(REASON_MESSAGES[reason], {
      ...meta,
      reason,
    });

    this.code = `geography:${reason}`;
  }
}
