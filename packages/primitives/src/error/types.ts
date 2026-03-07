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

  /** Machine-readable reason for the error */
  reason?: string;

  /** The underlying cause of the error */
  cause?: unknown;

  /** Structured domain metadata */
  details?: Readonly<Record<string, unknown>>;

  /** Diagnostic runtime context */
  context?: Readonly<Record<string, unknown>>;
}>;

/**
 * Core error reasons for common error scenarios
 *
 * @remarks
 * These reasons can be used in the `reason` property of error metadata to provide
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

/**
 * Type definition for JSON-serializable values
 */
export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

/**
 * Type definition for error-like objects
 *
 * @remarks
 * This type represents any object that has the essential properties of an error (code, message, and optional metadata).
 * It allows for flexibility in error handling by accepting both instances of BaseError and plain objects that conform to this structure.
 */
export type SafeErrorPayload = Readonly<{
  /** Error code identifying the type of error. */
  code: ErrorCode | "unknown";

  /** Human-readable error message. */
  message: string;

  /** HTTP status code associated with this error, if applicable */
  httpStatus?: number;

  /** Timestamp indicating when the error occurred */
  timestamp?: string;

  /** Machine-readable reason for the error */
  reason?: string;

  /** Structured domain metadata */
  details?: Readonly<Record<string, unknown>>;

  /** Diagnostic runtime context */
  context?: Readonly<Record<string, unknown>>;
}>;
