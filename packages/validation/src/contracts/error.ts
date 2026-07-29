import type { BaseError } from "@comity/primitives/errors";

/**
 * Single validation issue discovered while validating an input.
 */
export interface ValidationIssue {
  /** Optional stable code for machine handling. */
  readonly code?: string;

  /** Human-readable issue description. */
  readonly message: string;

  /** Optional input path, for example: "address.street". */
  readonly path?: string;

  /** Optional issue-specific metadata. */
  readonly meta?: Readonly<Record<string, unknown>>;
}

/**
 * Contract for validation errors returned by validators.
 */
export interface ValidationError extends BaseError {
  /** Collection of validation issues. */
  readonly issues?: readonly ValidationIssue[];
}
