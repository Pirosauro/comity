import type { ErrorMeta } from "./types.js";

/**
 * Base error class for all Comity framework errors
 *
 * @remarks
 * All Comity errors extend this base class to ensure consistent error handling,
 * metadata attachment, and serialization. The class provides:
 *
 * - Machine-readable error codes for programmatic handling
 * - Structured metadata with HTTP status codes and additional context
 * - Immutable metadata to prevent accidental modification
 * - Proper error chaining with cause support
 *
 * Error metadata is frozen to prevent accidental mutation after creation.
 *
 * @example
 * Creating a custom error class
 * ```typescript
 * class CustomError extends BaseError {
 *   readonly code = "CUSTOM_ERROR";
 *
 *   constructor(message: string, details?: unknown) {
 *     super(message, {
 *       httpStatus: 422,
 *       details
 *     });
 *   }
 * }
 *
 * throw new CustomError("Invalid operation", { operation: "delete", reason: "readonly" });
 * ```
 *
 * @example
 * Error handling with metadata
 * ```typescript
 * try {
 *   await riskyOperation();
 * } catch (error) {
 *   if (error instanceof BaseError) {
 *     console.error(`${error.code}: ${error.message}`);
 *     if (error.meta.httpStatus) {
 *       // Send appropriate HTTP response
 *     }
 *   }
 * }
 * ```
 */
export abstract class BaseError extends Error {
  /** Stable, machine-readable error code */
  abstract readonly code: string;

  /** Additional metadata associated with this error */
  readonly meta: Omit<ErrorMeta, "cause">;

  /**
   * @param message Human-readable error message
   * @param meta.cause The underlying cause of the error
   * @param meta - Error metadata including HTTP status, details, and cause
   * @protected
   */
  protected constructor(message: string, { cause, ...meta }: ErrorMeta = {}) {
    super(message, cause ? { cause } : undefined);

    this.name = new.target.name;
    this.meta = Object.freeze(meta);
  }
}
