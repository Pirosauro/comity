import type { Result } from "@comity/primitives/result";
import type { ValidationError } from "@comity/validation/errors";
import type { Address } from "../entities/address.js";

/**
 * Address validator is responsible for validating addresses.
 */
export interface AddressValidator {
  /** Validates an address. */
  validate(address: Address): Result<Address, ValidationError>;
}
