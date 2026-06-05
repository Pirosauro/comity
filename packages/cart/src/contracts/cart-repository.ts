import type { Result } from "@comity/primitives/result";
import type { CartError } from "../error/cart.js";
import type { CartModel } from "./cart.js";
import type { CartItemOptionModel } from "./item.js";

/**
 * Input for adding an item to the cart.
 */
export interface CartAddItemInput {
  /** Product ID to add to the cart */
  readonly productId: string;

  /** Quantity to add */
  readonly quantity: number;

  /** Optional variant selection. */
  readonly options?: readonly CartItemOptionModel[];
}

/**
 * Cart repository contract.
 */
export interface CartRepository {
  /**
   * Retrieve a cart by identifier.
   *
   * @param id - Cart ID.
   *
   * @returns Cart model or null if not found.
   */
  get(id: string): Promise<Result<CartModel | null, CartError>>;

  /**
   * Add a product to the cart.
   *
   * @param input - Input data for adding an item to the cart.
   *
   * @returns Updated cart model.
   */
  addItem(input: CartAddItemInput): Promise<Result<CartModel, CartError>>;

  /**
   * Remove an item from the cart.
   *
   * @param itemId - Cart item ID.
   *
   * @returns Updated cart model.
   */
  removeItem(itemId: string): Promise<Result<CartModel, CartError>>;

  /**
   * Update item quantity.
   *
   * @param itemId - Cart item ID.
   * @param quantity - New quantity.
   *
   * @returns Updated cart model.
   */
  updateItemQuantity(itemId: string, quantity: number): Promise<Result<CartModel, CartError>>;

  /**
   * Apply a discount coupon.
   *
   * @param code - Coupon code.
   *
   * @returns Updated cart model.
   */
  applyCoupon(code: string): Promise<Result<CartModel, CartError>>;

  /**
   * Remove a discount coupon.
   *
   * @param code - Coupon code to remove.
   *
   * @returns Updated cart model.
   */
  removeCoupon(code: string): Promise<Result<CartModel, CartError>>;

  /**
   * Clear all items from cart.
   *
   * @returns Empty cart model.
   */
  clear(): Promise<Result<CartModel, CartError>>;
}
