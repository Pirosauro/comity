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
export type ErrorMeta = Readonly<{
  /** HTTP status code associated with this error, if applicable */
  httpStatus?: number;

  /** Additional details about the error (structured data) */
  details?: unknown;

  /** The underlying cause of the error */
  cause?: unknown;
}> &
  Record<string, unknown>;

/**
 * Core error reasons for common error scenarios
 *
 * @remarks
 * These reasons can be used in the `details` property of error metadata to provide
 * standardized machine-readable explanations for common error cases, facilitating
 * consistent error handling across the application.
 */
export type CoreErrorReason =
  | "not_found"
  | "invalid_input"
  | "unauthorized"
  | "forbidden"
  | "conflict"
  | "timeout"
  | "service_unavailable"
  | "internal"
  | "domain_violation";
