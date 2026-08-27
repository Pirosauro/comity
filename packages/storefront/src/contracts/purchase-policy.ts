import type { Result } from "@comity/primitives/result";
import type { ProductProjection } from "@comity/catalog";
import type { PurchaseContext } from "../contracts/purchase-context.js";
import type { PurchaseError } from "../errors/purchase-error.js";

/**
 * Application-owned contract for evaluating product purchasability.
 *
 * The Catalog describes what a product is. The Application decides whether
 * it can be purchased in a given commercial context.
 *
 * This contract is owned by the Application Layer. Core Modules MUST NOT
 * depend on it.
 */
export interface PurchasePolicy {
  /**
   * Evaluates whether a product can be purchased in the given context.
   *
   * @param product - The product projection to evaluate.
   * @param context - The commercial context for the purchase.
   *
   * @returns Success if the product is purchasable, failure with PurchaseError otherwise.
   */
  canPurchase(
    product: ProductProjection,
    context: PurchaseContext
  ): Result<void, PurchaseError>;
}