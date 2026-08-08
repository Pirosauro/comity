import type { PriceModel, PriceModifierModel } from "@comity/catalog";

/**
 * Product information associated with an order item.
 */
export interface OrderProductModel {
  /** Unique product identifier. */
  readonly id: string;

  /** Stock Keeping Unit. */
  readonly sku?: string;

  /** Product name. */
  readonly name?: string;

  /** Absolute image URL. */
  readonly image?: string;

  /** Absolute page URL. */
  readonly url?: string;

  /** Custom attributes. */
  readonly meta?: Record<string, unknown>;
}

/**
 * Selected option for an order item (e.g., size, color).
 */
export interface OrderItemOptionModel {
  /** Option code. */
  readonly code: string;

  /** Option value. */
  readonly value: string;
}

/**
 * Order line item.
 */
export interface OrderItemModel {
  /** Unique item identifier within the order. */
  readonly id: string;

  /** Associated product. */
  readonly product: OrderProductModel;

  /** Requested quantity. */
  readonly quantity: number;

  /** Unit and total price (before item-level modifiers). */
  readonly price: Readonly<{
    /** Unit price for this item (price per single quantity, before discounts). */
    unit: PriceModel;

    /** Total price for this item (quantity × unit price, before discounts). */
    total: PriceModel;
  }>;

  /** Item-level price modifiers (coupons, taxes, discounts specific to this line). */
  readonly modifiers?: ReadonlyArray<PriceModifierModel>;

  /** Selected options (e.g., size, color). */
  readonly options?: ReadonlyArray<OrderItemOptionModel>;

  /** Custom metadata. */
  readonly meta?: Record<string, unknown>;
}