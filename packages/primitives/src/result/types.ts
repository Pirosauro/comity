import type { BaseError } from "../error/base.js";

/**
 * Success result contract
 *
 * @typeParam Value - Type of the success value
 *
 * @param value Result value
 * @param meta Optional metadata
 *
 */
export type ResultSuccess<Value, Discriminator extends string = "success"> = {
  /** Result value */
  readonly value: Value;

  /** Optional metadata */
  readonly meta?: Record<string, unknown>;
} & { readonly [K in Discriminator]: true };

/**
 * Failure result contract
 *
 * @typeParam Error - Type of the failure error (extends BaseError)
 * @typeParam Discriminator - Key used to discriminate success/failure (default: 'success')
 *
 * @param error - Error instance
 *
 */
export type ResultFailure<
  E extends BaseError = BaseError,
  Discriminator extends string = "success",
> = {
  /** Error instance */
  readonly error: E;
} & { readonly [K in Discriminator]: false };

/**
 * Prevent using reserved discriminators.
 */
type PreventReservedDiscriminator<K extends string> = K extends "value"
  ? {
      /** Discriminator error description */
      _error: "Cannot use 'value' as discriminator. It's used for the success value.";
    }
  : K extends "error"
    ? {
        /** Discriminator error description */
        _error: "Cannot use 'error' as discriminator. It's used for the failure error.";
      }
    : K extends "meta"
      ? {
          /** Discriminator error description */
          _error: "Cannot use 'meta' as discriminator. It's used for metadata.";
        }
      : K; // Valid key

/**
 * Generic result type for fallible operations.
 *
 * @typeParam Value - Type of the success value
 * @typeParam E - Type of the failure error (extends BaseError)
 * @typeParam Discriminator - Key used to discriminate success/failure (default: 'success')
 *
 * @remarks
 * Uses 'success' discriminator for semantic clarity.
 *
 * @example
 * Successful result
 * ```typescript
 * const result: Result<number> = {
 *   success: true,
 *   value: 42,
 *   meta: { timestamp: Date.now() },
 * };
 * ```
 *
 * Failure result
 * ```typescript
 * const result: Result<number, MyError> = {
 *   success: false,
 *   error: new MyError("Something went wrong"),
 * };
 * ```
 */
export type Result<
  Value,
  E extends BaseError = BaseError,
  Discriminator extends string = "success",
> =
  PreventReservedDiscriminator<Discriminator> extends infer CheckedDiscriminator // Validate discriminator
    ? CheckedDiscriminator extends string // Valid discriminator
      ? ResultSuccess<Value, Discriminator> | ResultFailure<E, Discriminator>
      : CheckedDiscriminator // Shows error object
    : never;
