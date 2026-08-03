import type { Result } from "@comity/primitives/result";
import type { ValidationError } from "../errors/validation.js";

/**
 * Validation result type.
 */
export type ValidationResult<T> = Result<T, ValidationError>;

/**
 * Validation contract.
 */
export interface Validator<T = unknown> {
  /**
   * Validates unknown input and returns a typed validation result.
   *
   * @param input - The input to validate.
   *
   * @returns A validation result containing either the validated value of type T or a ValidationError.
   */
  validate(input: T): ValidationResult<T> | Promise<ValidationResult<T>>;
}
