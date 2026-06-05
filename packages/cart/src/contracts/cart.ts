import type { PriceModel } from "@comity/catalog";
import type { CartItemModel } from "./item.js";

/**
 * Shopping cart model.
 */
export interface CartModel {
  /** Unique cart identifier. */
  readonly id: string;

  /** Cart items. */
  readonly items: CartItemModel[];

  /** Applied coupon codes */
  readonly coupons?: ReadonlyArray<string>;

  /** Cart pricing */
  readonly price: PriceModel;

  /** Custom metadata */
  readonly meta?: Record<string, unknown>;
}
