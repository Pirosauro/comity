import type { PriceModel, PriceModifierModel } from "@comity/catalog";

import type { OrderItemModel } from "./item.js";

/**
 * Order status.
 *
 * An order starts in {@link OrderStatus."draft"} and progresses through a linear lifecycle.
 * Each transition is explicit; the status cannot move backwards.
 *
 * Transitions:
 * - `draft` → `pending` (submit)
 * - `pending` → `confirmed` (confirm)
 * - `confirmed` → `fulfilled` (fulfill)
 * - `draft | pending | confirmed` → `cancelled` (cancel)
 */
export type OrderStatus =
  | "draft"
  | "pending"
  | "confirmed"
  | "fulfilled"
  | "cancelled";

/**
 * Order model.
 *
 * Represents both active carts ({@link OrderStatus."draft"}) and processed orders.
 */
export interface OrderModel {
  /** Unique order identifier. */
  readonly id: string;

  /** Order lifecycle status. */
  readonly status: OrderStatus;

  /** Order items. */
  readonly items: ReadonlyArray<OrderItemModel>;

  /** Applied price modifiers (discounts, taxes, shipping, fees). */
  readonly modifiers?: ReadonlyArray<PriceModifierModel>;

  /** Order pricing. */
  readonly price: PriceModel;

  /** Custom metadata. */
  readonly meta?: Record<string, unknown>;

  /** Creation timestamp. */
  readonly createdAt?: Date;

  /** Last update timestamp. */
  readonly updatedAt?: Date;
}