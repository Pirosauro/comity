/**
 * Type definition for error code
 *
 * @remarks
 * The error code is a stable, machine-readable identifier for the error type,
 * following the pattern "namespace:failure_kind". This allows for programmatic handling
 * of specific error cases based on their codes.
 */
export type ErrorCode = `${string}:${string}`;

/**
 * Type definition for error metadata
 *
 * @remarks
 * Error metadata provides additional context about errors, including HTTP status codes,
 * structured details, and causal relationships. The metadata object is extensible to
 * allow custom properties for specific error types.
 */
export type ErrorMeta = {
  /** HTTP status code associated with this error, if applicable */
  httpStatus?: number;

  /** Additional details about the error (structured data) */
  details?: unknown;

  /** The underlying cause of the error */
  cause?: unknown;
} & Record<string, unknown>;
