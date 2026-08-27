export type {
  CustomerRepository,
  CustomerSearchCriteria,
  CustomerSearchResult,
} from "./contracts/customer-repository.js";
export type { CustomerValidator } from "./contracts/customer-validator.js";
export type {
  CustomerContact,
  CustomerCreate,
  CustomerData,
  CustomerPreferences,
  CustomerSnapshot,
  CustomerState,
  CustomerUpdate,
} from "./contracts/customer.js";

export { Customer } from "./entities/customer.js";
export { CustomerId } from "./value-objects/customer-id.js";
