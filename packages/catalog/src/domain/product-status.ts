import { failure, success, type Result } from "@comity/primitives/result";

import type { ProductStatus } from "../contracts/product.js";
import { CatalogError } from "../errors/catalog.js";

const TRANSITIONS: Readonly<Record<ProductStatus, readonly ProductStatus[]>> = {
  draft: ["active"],
  active: ["inactive", "archived"],
  inactive: ["active", "archived"],
  archived: [],
};

/**
 * Validates and applies a product status transition.
 *
 * Transitions are explicit and cannot move backwards. Self-transitions are
 * rejected.
 *
 * @param from - The current product status.
 * @param to - The requested target status.
 *
 * @returns The target status when the transition is valid, or an error.
 */
export function transitionProductStatus(
  from: ProductStatus,
  to: ProductStatus
): Result<ProductStatus, CatalogError> {
  if (from === to || !TRANSITIONS[from].includes(to)) {
    return failure(
      new CatalogError("invalid_status_transition", {
        details: { from, to },
      })
    );
  }

  return success(to);
}