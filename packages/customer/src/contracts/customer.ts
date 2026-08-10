import type { Instant } from "@comity/primitives/time";
import type { CustomerId } from "../value-objects/customer-id.js";

/**
 * Generic contact method for a customer.
 */
export interface CustomerContact {
  /** The type of contact, e.g., "email" or "phone". */
  readonly type: string;

  /** The contact value. */
  readonly value: string;
}

/**
 * Customer preferences — open-ended key/value pairs.
 * Applications define their own preference keys.
 */
export type CustomerPreferences = Readonly<Record<string, unknown>>;

/**
 * Customer identity and profile data.
 */
export interface CustomerData {
  /** The display name for the customer. */
  readonly displayName: string | null;

  /** The name of the customer, if provided. */
  readonly givenName: string | null;

  /** The surname of the customer, if provided. */
  readonly familyName: string | null;

  /** The contacts for the customer. */
  readonly contacts: ReadonlyArray<CustomerContact>;

  /** The preferences for the customer. */
  readonly preferences: CustomerPreferences;
}

/**
 * The persistent state of an existing customer.
 */
export interface CustomerState extends CustomerData {
  /** The unique identifier of the customer. */
  readonly id: CustomerId;

  /** The timestamp when the customer was created. */
  readonly createdAt: Instant;

  /** The timestamp when the customer was last updated, if applicable. */
  readonly updatedAt: Instant;

  /** The timestamp when the customer was deleted, if applicable. */
  readonly deletedAt: Instant | null;
}

/**
 * Immutable point-in-time snapshot of an existing customer.
 */
export type CustomerSnapshot = Readonly<
  CustomerState & {
    /** The timestamp when the snapshot was captured. */
    readonly capturedAt: Instant;
  }
>;

/**
 * Data required to create a new customer.
 */
export type CustomerCreate = CustomerData & {
  /** The timestamp when the customer was created. */
  readonly createdAt?: Instant;

  /** The timestamp when the customer was last updated, if applicable. */
  readonly updatedAt?: Instant;

  /** The timestamp when the customer was deleted, if applicable. */
  readonly deletedAt?: Instant | null;
};

/**
 * Partial update data for a customer.
 */
export type CustomerUpdate = Partial<CustomerState>;
