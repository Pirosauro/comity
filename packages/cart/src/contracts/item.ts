import type { PriceModel } from "@comity/catalog";

/**
 * Product information associated with a cart item.
 */
export interface CartProductModel {
  /** Unique product identifier */
  readonly id: string;

  /** Stock Keeping Unit */
  readonly sku?: string;

  /** Product name */
  readonly name?: string;

  /** Absolute image URL */
  readonly image?: string;

  /** Absolute page URL */
  readonly url?: string;

  /** Custom attributes */
  readonly meta?: Record<string, unknown>;
}

/**
 * Selected option for a cart item (e.g., size, color).
 */
export interface CartItemOptionModel {
  /** Option code */
  readonly code: string;

  /** Option value */
  readonly value: string;
}

/**
 * Shopping cart line item.
 */
export interface CartItemModel {
  /** Unique item identifier in cart */
  readonly id: string;

  /** Associated product */
  readonly product: CartProductModel;

  /** Requested quantity */
  readonly quantity: number;

  /** Unit price (before discounts) */
  readonly price: Readonly<{
    /** Unit price for this item (price per single quantity, before discounts). */
    unit: PriceModel;

    /** Total price for this item (quantity * unit price, before discounts). */
    total: PriceModel;
  }>;

  /** Selected options (e.g., size, color) */
  readonly options?: CartItemOptionModel[];

  /** Custom metadata */
  readonly meta?: Record<string, unknown>;
}
