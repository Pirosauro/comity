import type { Result } from "@comity/primitives/result";

import type { OrderError } from "../errors/order.js";
import type { OrderItemOptionModel } from "./item.js";
import type { OrderModel } from "./order.js";

/**
 * Input for adding an item to the order.
 */
export interface OrderAddItemInput {
  /** Product ID to add to the order. */
  readonly productId: string;

  /** Quantity to add. */
  readonly quantity: number;

  /** Optional variant selection. */
  readonly options?: ReadonlyArray<OrderItemOptionModel>;
}

/**
 * Domain command port for order lifecycle operations.
 *
 * @remarks
 * Commands enforce business rules and coordinate the order aggregate. They
 * return domain errors (`OrderError`), never raw `RepositoryError`. When a
 * command delegates to a `OrderRepository`, infrastructure failures are
 * wrapped with `OrderError` reason `repository_error`.
 */
export interface OrderCommands {
  /**
   * Add a product to the order.
   *
   * @param input - Input data for adding an item to the order.
   *
   * @returns Updated order model.
   */
  addItem(input: OrderAddItemInput): Promise<Result<OrderModel, OrderError>>;

  /**
   * Remove an item from the order.
   *
   * @param itemId - Order item ID.
   *
   * @returns Updated order model.
   */
  removeItem(itemId: string): Promise<Result<OrderModel, OrderError>>;

  /**
   * Update item quantity.
   *
   * @param itemId - Order item ID.
   * @param quantity - New quantity.
   *
   * @returns Updated order model.
   */
  updateItemQuantity(itemId: string, quantity: number): Promise<Result<OrderModel, OrderError>>;

  /**
   * Apply a discount coupon.
   *
   * @param code - Coupon code.
   *
   * @returns Updated order model.
   */
  applyCoupon(code: string): Promise<Result<OrderModel, OrderError>>;

  /**
   * Remove a discount coupon.
   *
   * @param code - Coupon code to remove.
   *
   * @returns Updated order model.
   */
  removeCoupon(code: string): Promise<Result<OrderModel, OrderError>>;

  /**
   * Clear all items from the order.
   *
   * @returns Empty order model.
   */
  clear(): Promise<Result<OrderModel, OrderError>>;
}