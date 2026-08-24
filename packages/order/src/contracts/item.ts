import type { Price } from "@comity/pricing";

/**
 * Product attribute snapshot associated with an order item.
 *
 * A frozen copy of a product attribute at purchase time. It mirrors
 * `ProductAttribute` from `@comity/catalog` without importing catalog types:
 * the order stays independent of the catalog read model.
 */
export interface OrderProductAttribute {
  /** Attribute code. */
  readonly code: string;

  /** Display name of the attribute. */
  readonly label?: string;

  /** Attribute value. */
  readonly value: string | number | boolean;
}

/**
 * Selected option snapshot for an order item (e.g. size = "M", color = "blue").
 *
 * A frozen copy of a chosen product option at purchase time. It mirrors
 * `ProductOptionSelection` from `@comity/catalog` without importing catalog
 * types; the `label` is preserved so the selection stays renderable without
 * the catalog.
 */
export interface OrderProductOption {
  /** Option code. */
  readonly code: string;

  /** Display name of the option. */
  readonly label?: string;

  /** Selected option value. */
  readonly value: string;
}

/**
 * Product variant snapshot associated with an order item.
 *
 * A frozen copy of the purchased product variant at purchase time. It mirrors
 * `ProductVariant` from `@comity/catalog` without importing catalog types and
 * carries no pricing or inventory — those belong to their owning modules.
 */
export interface OrderVariantSnapshot {
  /** Variant identifier. */
  readonly id: string;

  /** Stock Keeping Unit of the variant. */
  readonly sku?: string;

  /** Display name of the variant. */
  readonly name?: string;

  /** Variant attribute snapshots. */
  readonly attributes?: ReadonlyArray<OrderProductAttribute>;

  /** Selected option snapshots of the variant. */
  readonly options?: ReadonlyArray<OrderProductOption>;
}

/**
 * Immutable product snapshot associated with an order item.
 *
 * A self-contained representation of the product as it was at purchase time.
 * It is NOT `ProductProjection` from `@comity/catalog` and it is NOT a
 * reference to the catalog: once the order is created it MUST NOT depend on
 * the catalog for its content. Historical order rendering, customer support,
 * invoice generation, and returns workflows rely exclusively on this record.
 */
export interface OrderProductSnapshot {
  /** Reference to the catalog product identifier, if still known. */
  readonly productId?: string;

  /** Stock Keeping Unit. */
  readonly sku: string;

  /** Product name. */
  readonly name: string;

  /** The purchased variant, if the product is variant-based. */
  readonly variant?: OrderVariantSnapshot;

  /** Product attribute snapshots. */
  readonly attributes?: ReadonlyArray<OrderProductAttribute>;

  /** Selected option snapshots. */
  readonly options?: ReadonlyArray<OrderProductOption>;

  /** Free-form metadata (e.g. image URL, page URL). */
  readonly metadata?: Readonly<Record<string, unknown>>;
}

/**
 * Order line item.
 *
 * Embedded value structure of the Order aggregate: it has no independent
 * identity, lifecycle, or repository.
 */
export interface OrderItem {
  /** Unique item identifier within the order. */
  readonly id: string;

  /** Associated product snapshot. */
  readonly product: OrderProductSnapshot;

  /** Requested quantity. */
  readonly quantity: number;

  /**
   * Full line price (subtotal, applied modifiers, total).
   *
   * `@comity/pricing` is the single owner of price composition data: price
   * modifiers are accessed exclusively through `price.modifiers`. The order
   * stores the immutable `Price` value and never duplicates modifier storage.
   */
  readonly price: Price;

  /** Custom metadata. */
  readonly meta?: Record<string, unknown>;
}
