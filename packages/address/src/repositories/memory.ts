import type { RepositoryError } from "@comity/primitives/errors";
import type { Result } from "@comity/primitives/result";
import type { AddressRepository } from "../contracts/address-repository.js";
import type { Address } from "../entities/address.js";
import type { AddressId } from "../value-objects/address-id.js";

import { success } from "@comity/primitives/result";

/**
 * In-memory implementation of `AddressRepository` for testing and development purposes.
 *
 * Note: This implementation is not suitable for production use as it does not persist
 * sessions and is not shared across multiple instances of the application.
 */
export class MemoryAddressRepository implements AddressRepository {
  /** */
  #addresses = new Map<string, Address>();

  /**
   * @inheritdoc
   */
  async getById(id: AddressId): Promise<Result<Address | null, RepositoryError>> {
    const address = this.#addresses.get(id.toString());

    if (!address) {
      return success(null);
    }

    return success(address);
  }

  /**
   * @inheritdoc
   */
  async save(address: Address): Promise<Result<void, RepositoryError>> {
    this.#addresses.set(address.id!.toString(), address);

    return success(undefined);
  }
}
