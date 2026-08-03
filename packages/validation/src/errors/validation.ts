import type { ErrorMeta } from "@comity/primitives/errors";

import { BaseError } from "@comity/primitives/errors";

/**
 * Validation module error reasons.
 */
export type ValidationErrorReason = "failed";

/**
 * Validation issue.
 */
export interface ValidationIssue {
  /** Validation error code */
  code: string;
}

/**
 * Validation error details.
 */
export interface ValidationErrorDetails {
  /**
   * A mapping of field names to an array of validation error codes.
   */
  fields?: Readonly<Record<string, ReadonlyArray<ValidationIssue>>>;
}

/**
 * Validation module error metadata.
 */
export interface ValidationErrorMeta extends ErrorMeta {
  /** The reason for the validation error. */
  readonly reason: ValidationErrorReason;

  /** Additional details about the validation error. */
  readonly details?: Readonly<ValidationErrorDetails>;
}

const REASON_MESSAGES: Record<ValidationErrorReason, string> = {
  failed: "Validation failed",
};

/**
 * Validation module errors.
 */
export class ValidationError extends BaseError<ValidationErrorMeta> {
  readonly code: `validation:${ValidationErrorReason}`;

  constructor(reason: ValidationErrorReason, meta?: Omit<ValidationErrorMeta, "reason">) {
    super(REASON_MESSAGES[reason], {
      ...meta,
      reason,
    });

    this.code = `validation:${reason}`;
  }
}
