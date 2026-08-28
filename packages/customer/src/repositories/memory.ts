import type { TenantId } from "@comity/organization";
import type { RepositoryError } from "@comity/primitives/errors";
import type { Result } from "@comity/primitives/result";
import type {
  CustomerRepository,
  CustomerSearchCriteria,
  CustomerSearchResult,
} from "../contracts/customer-repository.js";
import type { CustomerState } from "../contracts/customer.js";
import type { Customer } from "../entities/customer.js";
import type { CustomerId } from "../value-objects/customer-id.js";

import { success } from "@comity/primitives/result";

/**
 * In-memory implementation of `CustomerRepository` for testing and development purposes.
 *
 * Note: This implementation is not suitable for production use as it does not persist
 * sessions and is not shared across multiple instances of the application.
 */
export class MemoryCustomerRepository implements CustomerRepository {
  /** Internal storage keyed by tenant + customer ID */
  #customers = new Map<string, Customer>();

  #makeKey(tenant: TenantId, id: CustomerId): string {
    return `${tenant.toString()}:${id.toString()}`;
  }

  /**
   * @inheritdoc
   */
  async getById(
    id: CustomerId,
    tenant: TenantId
  ): Promise<Result<Customer | null, RepositoryError>> {
    const customer = this.#customers.get(this.#makeKey(tenant, id));

    if (!customer) {
      return success(null);
    }

    return success(customer);
  }

  /**
   * @inheritdoc
   */
  async save(customer: Customer, tenant: TenantId): Promise<Result<void, RepositoryError>> {
    this.#customers.set(this.#makeKey(tenant, customer.id!), customer);

    return success(undefined);
  }

  /**
   * @inheritdoc
   */
  async remove(id: CustomerId, tenant: TenantId): Promise<Result<void, RepositoryError>> {
    this.#customers.delete(this.#makeKey(tenant, id));

    return success(undefined);
  }

  /**
   * @inheritdoc
   */
  async search(
    criteria: CustomerSearchCriteria | undefined,
    tenant: TenantId
  ): Promise<Result<CustomerSearchResult, RepositoryError>> {
    const tenantPrefix = `${tenant.toString()}:`;
    const all = [...this.#customers.entries()]
      .filter(([key]) => key.startsWith(tenantPrefix))
      .map(([, customer]) => customer);
    let filtered = all;

    if (criteria?.query) {
      const lowercaseQuery = criteria.query.toLowerCase();

      filtered = filtered.filter(
        (c) =>
          (c.displayName?.toLowerCase().includes(lowercaseQuery) ||
            c.givenName?.toLowerCase().includes(lowercaseQuery) ||
            c.familyName?.toLowerCase().includes(lowercaseQuery)) === true
      );
    }

    const limit = criteria?.limit ?? all.length;
    const offset = criteria?.offset ?? 0;
    const items = all.slice(offset, offset + limit).map((c): CustomerState => ({
      id: c.id!,
      displayName: c.displayName,
      givenName: c.givenName,
      familyName: c.familyName,
      contacts: c.contacts,
      preferences: c.preferences,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
      deletedAt: c.deletedAt ?? null,
    }));

    const total = all.length;

    return success({
      items,
      total,
    });
  }
}
