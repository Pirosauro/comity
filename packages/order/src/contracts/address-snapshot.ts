import type { Instant } from "@comity/primitives/time";

/**
 * Role an address plays within a purchase.
 */
export type OrderAddressRole = "shipping" | "billing";

/**
 * Immutable historical fact about an address used by an order.
 *
 * A plain, owned representation of an address as it was at purchase time. It
 * is NOT `Address` from `@comity/address` and it is not a reference to the
 * address module: once the order is created it MUST NOT depend on the address
 * module for its content.
 *
 * A single generic type describes every address; the {@link role} discriminates
 * between shipping and billing. Identical addresses are represented once per
 * role rather than as a dedicated `ShippingAddress`/`BillingAddress` shape.
 */
export interface OrderAddressSnapshot {
  /** Reference to the address identifier, if still known. */
  readonly addressId?: string;

  /** The role of the address within the purchase. */
  readonly role: OrderAddressRole;

  /** Free-form address lines, e.g. street address. */
  readonly lines: ReadonlyArray<string>;

  /** The city of the address. */
  readonly city: string;

  /** The administrative area (e.g. state or province), if any. */
  readonly administrativeArea?: string;

  /** The postal code of the address. */
  readonly postalCode: string;

  /** The country code of the address. */
  readonly countryCode: string;

  /** The timestamp when the address fact was captured. */
  readonly capturedAt: Instant;
}
