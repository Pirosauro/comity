import { failure, success, type Result } from "@comity/primitives/result";

import type { ProductCreate, ProductProjection } from "../contracts/product.js";
import { CatalogError } from "../errors/catalog.js";

/**
 * Creates a product projection from validated input.
 *
 * @param input - The product creation input.
 *
 * @returns The immutable product projection, or a validation error.
 */
export function createProduct(
  input: ProductCreate
): Result<ProductProjection, CatalogError> {
  if (input.id.trim().length === 0) {
    return failure(
      new CatalogError("invalid_product", {
        details: { field: "id", productId: input.id },
      })
    );
  }

  if (input.name.trim().length === 0) {
    return failure(
      new CatalogError("invalid_product", {
        details: { field: "name", productId: input.id },
      })
    );
  }

  return success({
    ...input,
    status: input.status ?? "draft",
  });
}