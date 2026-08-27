import type { Address, AddressRepository } from "@comity/address";
import type { Result } from "@comity/primitives/result";

import { AddressId } from "@comity/address";
import { failure, isSuccess, success } from "@comity/primitives/result";
import { StorefrontError } from "../errors/storefront-error.js";

export interface AddressResolver {
  resolve(addressId: string): Promise<Result<Address, StorefrontError>>;
  resolveRequired(
    shippingAddressId: string,
    billingAddressId: string
  ): Promise<Result<{ shipping: Address; billing: Address }, StorefrontError>>;
}

export class DefaultAddressResolver implements AddressResolver {
  readonly #addressRepository: AddressRepository;

  constructor(addressRepository: AddressRepository) {
    this.#addressRepository = addressRepository;
  }

  async resolve(addressId: string): Promise<Result<Address, StorefrontError>> {
    const addressIdResult = AddressId.create(addressId);
    if (!isSuccess(addressIdResult)) {
      return failure(
        new StorefrontError("invalid_input", {
          details: { entityType: "address", entityId: addressId },
          cause: addressIdResult.error,
        })
      );
    }

    const result = await this.#addressRepository.getById(addressIdResult.value);
    if (!isSuccess(result)) {
      return failure(
        new StorefrontError("internal_error", {
          details: {
            entityType: "address",
            entityId: addressId,
            wrappedCode: result.error.code,
            ...(result.error.meta.reason !== undefined
              ? { wrappedReason: result.error.meta.reason }
              : {}),
          },
          cause: result.error,
        })
      );
    }

    if (result.value === null) {
      return failure(
        new StorefrontError("address_not_found", {
          details: { entityType: "address", entityId: addressId },
        })
      );
    }

    return success(result.value);
  }

  async resolveRequired(
    shippingAddressId: string,
    billingAddressId: string
  ): Promise<Result<{ shipping: Address; billing: Address }, StorefrontError>> {
    const shippingResult = await this.resolve(shippingAddressId);
    if (!isSuccess(shippingResult)) {
      return shippingResult;
    }

    const billingResult = await this.resolve(billingAddressId);
    if (!isSuccess(billingResult)) {
      return billingResult;
    }

    return success({ shipping: shippingResult.value, billing: billingResult.value });
  }
}
