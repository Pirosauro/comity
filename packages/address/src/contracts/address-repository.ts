import type { RepositoryError } from "@comity/primitives/errors";
import type { Result } from "@comity/primitives/result";
import type { Address } from "../entities/address.js";
import type { AddressId } from "../value-objects/address-id.js";

/**
 * Address repository contract.
 *
 * @remarks
 * Address intentionally exposes a minimal surface — only `getById` and `save`.
 *
 * - `search` is not provided because Address ownership is rooted in a parent
 *   aggregate (Customer, Order, etc.); a top-level search across all
 *   addresses would bypass that ownership. Address collections are reached
 *   through the parent aggregate, not through this repository.
 * - `remove` is not provided because Address deletion is governed by the
 *   parent aggregate's lifecycle; this repository exposes only the
 *   persistence operations that make sense in isolation.
 */
export interface AddressRepository {
  /** Retrieves an address by its ID */
  getById(id: AddressId): Promise<Result<Address | null, RepositoryError>>;

  /** Saves an address */
  save(address: Address): Promise<Result<void, RepositoryError>>;
}
