import type { OrderItem } from "@comity/order";
import type { Currency, Price } from "@comity/pricing";
import type { Result } from "@comity/primitives/result";
import type { ResolvedProductItem } from "./product-resolver.js";

import { Money as MoneyClass, calculatePrice } from "@comity/pricing";
import { failure, isSuccess, success } from "@comity/primitives/result";
import { StorefrontError } from "../errors/storefront-error.js";

export interface PricingService {
  calculate(
    items: readonly ResolvedProductItem[],
    currency: Currency
  ): Promise<Result<{ items: OrderItem[]; totalPrice: Price }, StorefrontError>>;
}

export class DefaultPricingService implements PricingService {
  async calculate(
    items: readonly ResolvedProductItem[],
    currency: Currency
  ): Promise<Result<{ items: OrderItem[]; totalPrice: Price }, StorefrontError>> {
    const orderItems: OrderItem[] = [];
    let subtotalAmount = 0n;

    for (const item of items) {
      // MVP: standard base unit amount per unit
      const unitAmount = 10000n; // 100.00 minor units
      const lineAmount = unitAmount * BigInt(item.quantity);

      const lineMoneyResult = MoneyClass.create(lineAmount, currency);
      if (!isSuccess(lineMoneyResult)) {
        return failure(
          new StorefrontError("internal_error", {
            details: { entityType: "pricing" },
            cause: lineMoneyResult.error,
          })
        );
      }

      const linePriceResult = calculatePrice(lineMoneyResult.value, []);
      if (!isSuccess(linePriceResult)) {
        return failure(
          new StorefrontError("internal_error", {
            details: { entityType: "pricing" },
            cause: linePriceResult.error,
          })
        );
      }

      subtotalAmount += lineAmount;

      orderItems.push({
        id: crypto.randomUUID(),
        product: item.productSnapshot,
        quantity: item.quantity,
        price: linePriceResult.value,
      });
    }

    const totalMoneyResult = MoneyClass.create(subtotalAmount, currency);
    if (!isSuccess(totalMoneyResult)) {
      return failure(
        new StorefrontError("internal_error", {
          details: { entityType: "pricing" },
          cause: totalMoneyResult.error,
        })
      );
    }

    const totalPriceResult = calculatePrice(totalMoneyResult.value, []);
    if (!isSuccess(totalPriceResult)) {
      return failure(
        new StorefrontError("internal_error", {
          details: { entityType: "pricing" },
          cause: totalPriceResult.error,
        })
      );
    }

    return success({
      items: orderItems,
      totalPrice: totalPriceResult.value,
    });
  }
}
