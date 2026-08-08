import type { Result } from "@comity/primitives/result";
import type { ValidationError } from "@comity/validation/errors";
import type { Customer } from "../entities/customer.js";

/**
 * Customer validator is responsible for validating customers.
 */
export interface CustomerValidator {
  /** Validates a customer. */
  validate(customer: Customer): Result<Customer, ValidationError>;
}
