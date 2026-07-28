import type { Result } from "@comity/primitives/result";

/**
 * Validation result type.
 */
export type ValidationResult<T> = Result<T, ValidationError>;

/**
 * Validation contract.
 */
export interface Validator<T> {
  /**
   * Validates unknown input and returns a typed validation result.
   */
  validate(input: unknown): ValidationResult<T> | Promise<ValidationResult<T>>;
}
