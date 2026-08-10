import type {
  AddressContact,
  AddressCreate,
  AddressSnapshot,
  AddressUpdate,
} from "../contracts/address.js";
import type { AddressId } from "../value-objects/address-id.js";
import type { AddressLine } from "../value-objects/address-line.js";

import { Instant } from "@comity/primitives/time";

/**
 * Represents an address entity in the system.
 */
export class Address {
  #id: AddressId | undefined;
  #lines: AddressLine[];
  #city: string;
  #administrativeArea: string | null;
  #postalCode: string;
  #countryCode: string;
  #label: string | null;
  #metadata: Record<string, string> | null;
  #contacts: AddressContact[];
  readonly #createdAt: Instant;
  #updatedAt: Instant;

  /**
   * @param fields - The fields used to create or hydrate the address.
   * @param id - The unique identifier of the address, if it has been assigned.
   */
  constructor(fields: AddressCreate, id?: AddressId) {
    this.#id = id;
    this.#lines = [...fields.lines];
    this.#city = fields.city;
    this.#administrativeArea = fields.administrativeArea;
    this.#postalCode = fields.postalCode;
    this.#countryCode = fields.countryCode;
    this.#label = fields.label;
    this.#metadata = fields.metadata ? { ...fields.metadata } : null;
    this.#contacts = [...fields.contacts];
    this.#createdAt = fields.createdAt ?? Instant.now();
    this.#updatedAt = fields.updatedAt ?? this.#createdAt;
  }

  /**
   * @returns The unique identifier of the address, if it has been assigned.
   */
  get id(): AddressId | undefined {
    return this.#id;
  }

  /**
   * @returns The address lines, which represent the street address.
   */
  get lines(): ReadonlyArray<AddressLine> {
    return [...this.#lines];
  }

  /**
   * @returns The city of the address.
   */
  get city(): string {
    return this.#city;
  }

  /**
   * @returns The administrative area (e.g., state or province) of the address, if applicable.
   */
  get administrativeArea(): string | null {
    return this.#administrativeArea;
  }

  /**
   * @returns The postal code of the address.
   */
  get postalCode(): string {
    return this.#postalCode;
  }

  /**
   * @returns The country code of the address.
   */
  get countryCode(): string {
    return this.#countryCode;
  }

  /**
   * @returns The label for the address, if it has been assigned.
   */
  get label(): string | null {
    return this.#label;
  }

  /**
   * @returns The metadata associated with the address, if it has been assigned.
   */
  get metadata(): Readonly<Record<string, string>> | null {
    return this.#metadata ? { ...this.#metadata } : null;
  }

  /**
   * @returns The contacts associated with the address.
   */
  get contacts(): ReadonlyArray<AddressContact> {
    return [...this.#contacts];
  }

  /**
   * @returns The timestamp when the address was created.
   */
  get createdAt(): Instant {
    return this.#createdAt;
  }

  /**
   * @returns The timestamp when the address was last updated.
   */
  get updatedAt(): Instant {
    return this.#updatedAt;
  }

  /**
   * Updates the address with the provided changes.
   *
   * @param changes - The changes to apply to the address.
   *
   * @returns A result indicating the success or failure of the update.
   */
  update(changes: AddressUpdate): void {
    // Line updates
    if (changes.lines !== undefined) {
      this.#lines = [...changes.lines];
    }

    // City update
    if (changes.city !== undefined) {
      this.#city = changes.city;
    }

    // Administrative area update
    if (changes.administrativeArea !== undefined) {
      this.#administrativeArea = changes.administrativeArea;
    }

    // Postal code update
    if (changes.postalCode !== undefined) {
      this.#postalCode = changes.postalCode;
    }

    // Country code update
    if (changes.countryCode !== undefined) {
      this.#countryCode = changes.countryCode;
    }

    // Label update
    if (changes.label !== undefined) {
      this.#label = changes.label;
    }

    // Metadata update
    if (changes.metadata !== undefined) {
      this.#metadata = changes.metadata ? { ...changes.metadata } : null;
    }

    // Contacts update
    if (changes.contacts !== undefined) {
      this.#contacts = [...changes.contacts];
    }

    // Update the updatedAt timestamp
    this.#updatedAt = Instant.now();
  }

  /**
   * Creates a snapshot of the current state of the address.
   *
   * @returns A snapshot representing the current state of the address.
   */
  snapshot(): AddressSnapshot {
    return {
      id: this.#id as AddressId,
      lines: [...this.#lines],
      city: this.#city,
      administrativeArea: this.#administrativeArea,
      postalCode: this.#postalCode,
      countryCode: this.#countryCode,
      label: this.#label,
      metadata: this.#metadata ? { ...this.#metadata } : null,
      contacts: [...this.#contacts],
      createdAt: this.#createdAt,
      updatedAt: this.#updatedAt,
      capturedAt: Instant.now(),
    };
  }
}
