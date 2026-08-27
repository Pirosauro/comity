import type { RepositoryError } from "@comity/primitives/errors";
import type { Result } from "@comity/primitives/result";
import type { Customer } from "../entities/customer.js";
import type { CustomerId } from "../value-objects/customer-id.js";
import type { TenantId } from "../value-objects/tenant-id.js";
import type { CustomerState } from "./customer.js";

/**
 * Minimal search/filter criteria for customers.
 */
export interface CustomerSearchCriteria {
  /** Free-text query string. */
  readonly query?: string | undefined;

  /** The maximum number of results to return. */
  readonly limit?: number | undefined;

  /** The offset for paginated results. */
  readonly offset?: number | undefined;
}

/**
 * Result of listing or searching customers.
 */
export interface CustomerSearchResult {
  /** The matching customers. */
  readonly items: ReadonlyArray<CustomerState>;

  /** Total number of matching customers. */
  readonly total: number;
}

/**
 * Customer repository is responsible for managing customer persistence.
 */
export interface CustomerRepository {
  /** Retrieves a customer by its ID */
  getById(id: CustomerId, tenant: TenantId): Promise<Result<Customer | null, RepositoryError>>;

  /** Saves a customer */
  save(customer: Customer, tenant: TenantId): Promise<Result<void, RepositoryError>>;

  /** Deletes a customer */
  remove(id: CustomerId, tenant: TenantId): Promise<Result<void, RepositoryError>>;

  /** Lists customers matching the given criteria */
  search(
    criteria: CustomerSearchCriteria | undefined,
    tenant: TenantId
  ): Promise<Result<CustomerSearchResult, RepositoryError>>;
}
