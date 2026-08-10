import type {
  CustomerContact,
  CustomerCreate,
  CustomerSnapshot,
  CustomerUpdate,
} from "../contracts/customer.js";
import type { CustomerId } from "../value-objects/customer-id.js";

import { Instant } from "@comity/primitives/time";

/**
 * Represents a customer entity in the system.
 *
 * @remark
 * A customer is a business principal — a person or entity that has a
 * business relationship with the platform. It is not an authentication
 * identity, not an access subject, not an organization.
 */
export class Customer {
  #id: CustomerId | undefined;
  #displayName: string | null;
  #givenName: string | null;
  #familyName: string | null;
  #contacts: CustomerContact[];
  #preferences: Record<string, unknown>;
  readonly #createdAt: Instant;
  #updatedAt: Instant;
  #deletedAt: Instant | null;

  /**
   * @param fields - The fields used to create the customer.
   * @param id - The unique identifier of the customer, if it has been assigned.
   */
  constructor(fields: CustomerCreate, id?: CustomerId) {
    this.#id = id;
    this.#displayName = fields.displayName;
    this.#givenName = fields.givenName;
    this.#familyName = fields.familyName;
    this.#contacts = [...fields.contacts];
    this.#preferences = { ...fields.preferences };
    this.#createdAt = fields.createdAt ?? Instant.now();
    this.#updatedAt = fields.updatedAt ?? this.#createdAt;
    this.#deletedAt = fields.deletedAt ?? null;
  }

  /**
   * @returns The unique identifier of the customer, if it has been assigned.
   */
  get id(): CustomerId | undefined {
    return this.#id;
  }

  /**
   * @returns The display name of the customer.
   */
  get displayName(): string | null {
    return this.#displayName;
  }

  /**
   * @returns The name of the customer, if provided.
   */
  get givenName(): string | null {
    return this.#givenName;
  }

  /**
   * @returns The surname of the customer, if provided.
   */
  get familyName(): string | null {
    return this.#familyName;
  }

  /**
   * @returns The contacts of the customer.
   */
  get contacts(): ReadonlyArray<CustomerContact> {
    return [...this.#contacts];
  }

  /**
   * @returns The preferences of the customer.
   */
  get preferences(): Readonly<Record<string, unknown>> {
    return { ...this.#preferences };
  }

  /**
   * @returns The timestamp when the customer was created.
   */
  get createdAt(): Instant {
    return this.#createdAt;
  }

  /**
   * @returns The timestamp when the customer was last updated, if applicable.
   */
  get updatedAt(): Instant {
    return this.#updatedAt;
  }

  /**
   * @returns The timestamp when the customer was deleted, if applicable.
   */
  get deletedAt(): Instant | null {
    return this.#deletedAt;
  }

  /**
   * Updates the customer with the provided changes.
   *
   * @param changes - The partial changes to apply to the customer.
   */
  update(changes: CustomerUpdate): void {
    if (changes.displayName !== undefined) {
      this.#displayName = changes.displayName;
    }

    if (changes.givenName !== undefined) {
      this.#givenName = changes.givenName;
    }

    if (changes.familyName !== undefined) {
      this.#familyName = changes.familyName;
    }

    if (changes.contacts !== undefined) {
      this.#contacts = [...changes.contacts];
    }

    if (changes.preferences !== undefined) {
      this.#preferences = { ...changes.preferences };
    }

    if (changes.deletedAt !== undefined) {
      this.#deletedAt = changes.deletedAt;
    }

    // Update the updatedAt timestamp
    this.#updatedAt = Instant.now();
  }

  /**
   * Creates a snapshot of the current state of the customer.
   * Requires the customer to have an assigned identifier.
   *
   * @returns A snapshot representing the current state of the customer.
   */
  snapshot(): CustomerSnapshot {
    return {
      id: this.#id as CustomerId,
      displayName: this.#displayName,
      givenName: this.#givenName,
      familyName: this.#familyName,
      contacts: [...this.#contacts],
      preferences: { ...this.#preferences },
      createdAt: this.#createdAt,
      updatedAt: this.#updatedAt,
      deletedAt: this.#deletedAt,
      capturedAt: Instant.now(),
    };
  }
}
