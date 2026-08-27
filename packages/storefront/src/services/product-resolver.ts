import type { ProductProjection, ProductRepository } from "@comity/catalog";
import type { OrderProductSnapshot, OrderVariantSnapshot } from "@comity/order";
import type { Result } from "@comity/primitives/result";
import type { PurchaseContext } from "../contracts/purchase-context.js";
import type { PurchasePolicy } from "../contracts/purchase-policy.js";

import { failure, isSuccess, success } from "@comity/primitives/result";
import { StorefrontError } from "../errors/storefront-error.js";

export interface ResolvedProductItem {
  readonly productSnapshot: OrderProductSnapshot;
  readonly quantity: number;
  readonly productId: string;
  readonly variantId: string | undefined;
}

export interface ProductResolver {
  resolve(
    items: readonly {
      readonly productId: string;
      readonly variantId?: string;
      readonly quantity: number;
    }[],
    context: PurchaseContext
  ): Promise<Result<readonly ResolvedProductItem[], StorefrontError>>;
}

export class DefaultProductResolver implements ProductResolver {
  readonly #productRepository: ProductRepository;
  readonly #purchasePolicy: PurchasePolicy;

  constructor(productRepository: ProductRepository, purchasePolicy: PurchasePolicy) {
    this.#productRepository = productRepository;
    this.#purchasePolicy = purchasePolicy;
  }

  async resolve(
    items: readonly {
      readonly productId: string;
      readonly variantId?: string;
      readonly quantity: number;
    }[],
    context: PurchaseContext
  ): Promise<Result<readonly ResolvedProductItem[], StorefrontError>> {
    if (!items || items.length === 0) {
      return failure(
        new StorefrontError("invalid_input", {
          details: { entityType: "order", wrappedReason: "Items list cannot be empty" },
        })
      );
    }

    const resolvedItems: ResolvedProductItem[] = [];

    for (const item of items) {
      if (!Number.isInteger(item.quantity) || item.quantity < 1) {
        return failure(
          new StorefrontError("invalid_input", {
            details: {
              entityType: "item",
              entityId: item.productId,
              wrappedReason: "Quantity must be a positive integer",
            },
          })
        );
      }

      const productResult = await this.#productRepository.getById(item.productId);
      if (!isSuccess(productResult)) {
        return failure(
          new StorefrontError("internal_error", {
            details: {
              entityType: "product",
              entityId: item.productId,
              wrappedCode: productResult.error.code,
              ...(productResult.error.meta.reason !== undefined
                ? { wrappedReason: productResult.error.meta.reason }
                : {}),
            },
            cause: productResult.error,
          })
        );
      }

      if (productResult.value === null) {
        return failure(
          new StorefrontError("product_not_found", {
            details: { entityType: "product", entityId: item.productId },
          })
        );
      }

      const product = productResult.value;

      const purchasabilityResult = this.#purchasePolicy.canPurchase(product, context);
      if (!isSuccess(purchasabilityResult)) {
        return failure(
          new StorefrontError("invalid_input", {
            details: {
              entityType: "product",
              entityId: product.id,
              wrappedCode: purchasabilityResult.error.code,
              wrappedReason: purchasabilityResult.error.meta.reason,
            },
            cause: purchasabilityResult.error,
          })
        );
      }

      const productSnapshot = this.#mapProductProjection(product, item.variantId);

      resolvedItems.push({
        productSnapshot,
        quantity: item.quantity,
        productId: item.productId,
        variantId: item.variantId,
      });
    }

    return success(resolvedItems);
  }

  #mapProductProjection(product: ProductProjection, variantId?: string): OrderProductSnapshot {
    const variant =
      variantId !== undefined
        ? product.variants?.find((v) => v.id === variantId)
        : product.variants?.[0];

    const variantSnapshot: OrderVariantSnapshot | undefined =
      variant !== undefined
        ? {
            id: variant.id,
            ...(variant.sku !== undefined ? { sku: variant.sku } : {}),
            ...(variant.name !== undefined ? { name: variant.name } : {}),
            ...(variant.attributes !== undefined
              ? {
                  attributes: variant.attributes.map((a) => ({
                    code: a.code,
                    ...(a.label !== undefined ? { label: a.label } : {}),
                    value: a.value,
                  })),
                }
              : {}),
            ...(variant.options !== undefined
              ? {
                  options: variant.options.map((o) => {
                    const optionDef = product.options?.find((opt) => opt.code === o.code);
                    return {
                      code: o.code,
                      ...(optionDef?.label !== undefined ? { label: optionDef.label } : {}),
                      value: o.value,
                    };
                  }),
                }
              : {}),
          }
        : undefined;

    return {
      productId: product.id,
      sku: variant?.sku ?? product.id,
      name: product.name,
      ...(variantSnapshot !== undefined ? { variant: variantSnapshot } : {}),
      ...(product.attributes !== undefined
        ? {
            attributes: product.attributes.map((a) => ({
              code: a.code,
              ...(a.label !== undefined ? { label: a.label } : {}),
              value: a.value,
            })),
          }
        : {}),
      ...(variantSnapshot?.options !== undefined ? { options: variantSnapshot.options } : {}),
    };
  }
}
