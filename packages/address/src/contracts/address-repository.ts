import type { RepositoryError } from "@comity/primitives/errors";
import type { Result } from "@comity/primitives/result";
import type { Address } from "../entities/address.js";
import type { AddressId } from "../value-objects/address-id.js";

/**
 * Address repository is responsible for managing address persistence.
 */
export interface AddressRepository {
  /** Retrieves an address by its ID */
  get(id: AddressId): Promise<Result<Address | null, RepositoryError>>;

  /** Saves an address */
  save(address: Address): Promise<Result<void, RepositoryError>>;
}
