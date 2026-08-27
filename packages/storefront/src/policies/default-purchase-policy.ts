import type { Result } from "@comity/primitives/result";
import type { ProductProjection } from "@comity/catalog";
import type { PurchaseContext } from "../contracts/purchase-context.js";
import type { PurchasePolicy } from "../contracts/purchase-policy.js";


import { failure, success } from "@comity/primitives/result";
import { PurchaseError } from "../errors/purchase-error.js";

/**
 * Default implementation of {@link PurchasePolicy} for MVP.
 *
 * The only rule: the product must have status "active".
 * This is a replaceable implementation — the Application may substitute it
 * with a policy that evaluates geography, licensing, channel rules, etc.
 */
export class DefaultPurchasePolicy implements PurchasePolicy {
  /**
   * @inheritdoc
   */
  canPurchase(
    product: ProductProjection,
    _context: PurchaseContext
  ): Result<void, PurchaseError> {
    if (product.status !== "active") {
      return failure(
        new PurchaseError("not_purchasable", {
          details: {
            productId: product.id,
            status: product.status,
          },
        })
      );
    }

    return success(undefined);
  }
}