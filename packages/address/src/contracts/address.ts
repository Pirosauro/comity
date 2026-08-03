import type { Instant } from "@comity/primitives/time";
import type { AddressId } from "../value-objects/address-id.js";
import type { AddressLine } from "../value-objects/address-line.js";

/**
 * AddressContact represents a contact method for an address, such as email or phone.
 */
export interface AddressContact {
  /** The type of contact, e.g., "email" or "phone" */
  readonly type: string;

  /** The contact value, e.g., email address or phone number */
  readonly value: string;
}

/**
 * AddressData represents the essential data of an address, excluding metadata and contacts.
 */
export interface AddressData {
  /** The address lines, e.g., street address */
  readonly lines: ReadonlyArray<AddressLine>;

  /** The city of the address */
  readonly city: string;

  /** The administrative area (e.g., state or province) of the address */
  readonly administrativeArea: string | null;

  /** The postal code of the address */
  readonly postalCode: string;

  /** The country code of the address */
  readonly countryCode: string;
}

/**
 * AddressState represents the state of an address entity in the system.
 */
export interface AddressState extends AddressData {
  /** The unique identifier of the address */
  readonly id: AddressId;
}

/**
 * Address represents a complete address entity in the system, including its state and additional metadata.
 */
export interface AddressFields extends AddressData {
  /** The label for the address, e.g., "Home" or "Work" */
  readonly label: string | null;

  /** Additional metadata associated with the address */
  readonly metadata: Readonly<Record<string, string>> | null;

  /** The contacts associated with the address */
  readonly contacts: ReadonlyArray<AddressContact>;
}

/**
 * AddressSnapshot is a read-only representation of the AddressState.
 */
export type AddressSnapshot = Readonly<
  AddressFields & {
    /** The unique identifier of the address */
    readonly id: AddressId | undefined;

    /** The timestamp when the snapshot was captured */
    readonly capturedAt: Instant;
  }
>;

/**
 * AddressCreate represents the data required to create a new Address entity.
 */
export type AddressCreate = Omit<AddressFields, "id">;

/**
 * AddressDataUpdate represents a partial update to an AddressData object.
 */
export type AddressUpdate = Partial<AddressFields>;
