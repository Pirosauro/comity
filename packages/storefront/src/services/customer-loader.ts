import type { Customer, CustomerRepository } from "@comity/customer";
import type { Result } from "@comity/primitives/result";

import { CustomerId } from "@comity/customer";
import { failure, isSuccess, success } from "@comity/primitives/result";
import { StorefrontError } from "../errors/storefront-error.js";

export interface CustomerLoader {
  load(customerId: string): Promise<Result<Customer, StorefrontError>>;
}

export class DefaultCustomerLoader implements CustomerLoader {
  readonly #customerRepository: CustomerRepository;

  constructor(customerRepository: CustomerRepository) {
    this.#customerRepository = customerRepository;
  }

  async load(customerId: string): Promise<Result<Customer, StorefrontError>> {
    const customerIdResult = CustomerId.create(customerId);
    if (!isSuccess(customerIdResult)) {
      return failure(
        new StorefrontError("invalid_input", {
          details: { entityType: "customer", entityId: customerId },
          cause: customerIdResult.error,
        })
      );
    }

    const result = await this.#customerRepository.getById(customerIdResult.value);
    if (!isSuccess(result)) {
      return failure(
        new StorefrontError("internal_error", {
          details: {
            entityType: "customer",
            entityId: customerId,
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
        new StorefrontError("customer_not_found", {
          details: { entityType: "customer", entityId: customerId },
        })
      );
    }

    const customer = result.value;
    if (customer.deletedAt !== null) {
      return failure(
        new StorefrontError("customer_not_found", {
          details: { entityType: "customer", entityId: customerId },
        })
      );
    }

    return success(customer);
  }
}
