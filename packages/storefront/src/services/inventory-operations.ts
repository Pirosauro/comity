import type { Reservation, StockRepository } from "@comity/inventory";
import type { OrderItem } from "@comity/order";
import type { Result } from "@comity/primitives/result";
import type { PurchaseContext } from "../contracts/purchase-context.js";

import { InventoryError, Quantity, Sku, StockId, WarehouseId } from "@comity/inventory";
import { failure, isSuccess, success } from "@comity/primitives/result";
import type { StorefrontErrorMeta } from "../errors/storefront-error.js";
import { StorefrontError } from "../errors/storefront-error.js";

export interface InventoryOperations {
  reserve(
    items: readonly OrderItem[],
    context: PurchaseContext
  ): Promise<Result<readonly Reservation[], StorefrontError>>;

  release(reservations: readonly Reservation[]): Promise<void>;

  commit(
    reservations: readonly Reservation[],
    context: PurchaseContext
  ): Promise<Result<void, StorefrontError>>;
}

export class DefaultInventoryOperations implements InventoryOperations {
  readonly #stockRepository: StockRepository;
  readonly #warehouseId: WarehouseId;

  constructor(stockRepository: StockRepository, warehouseId: WarehouseId) {
    this.#stockRepository = stockRepository;
    this.#warehouseId = warehouseId;
  }

  async reserve(
    items: readonly OrderItem[],
    context: PurchaseContext
  ): Promise<Result<readonly Reservation[], StorefrontError>> {
    const reservations: Reservation[] = [];

    for (const item of items) {
      const skuResult = Sku.create(item.product.sku);
      if (!isSuccess(skuResult)) {
        await this.release(reservations);
        return failure(
          new StorefrontError("internal_error", {
            details: {
              entityType: "inventory",
              wrappedReason: "Invalid SKU",
            },
            cause: skuResult.error,
          })
        );
      }

      const stockId = StockId.create(skuResult.value, this.#warehouseId);
      const stockResult = await this.#stockRepository.getById(stockId);

      if (!isSuccess(stockResult)) {
        await this.release(reservations);
        return failure(
          new StorefrontError("internal_error", {
            details: {
              entityType: "inventory",
              entityId: stockId.toString(),
              wrappedCode: stockResult.error.code,
              ...(stockResult.error.meta.reason !== undefined
                ? { wrappedReason: stockResult.error.meta.reason }
                : {}),
            },
            cause: stockResult.error,
          })
        );
      }

      if (stockResult.value === null) {
        await this.release(reservations);
        return failure(
          new StorefrontError("invalid_input", {
            details: {
              entityType: "inventory",
              entityId: stockId.toString(),
              wrappedReason: "Stock not found for SKU",
            },
          })
        );
      }

      const stock = stockResult.value;
      const quantityResult = Quantity.create(BigInt(item.quantity), 0);
      if (!isSuccess(quantityResult)) {
        await this.release(reservations);
        return failure(
          new StorefrontError("internal_error", {
            details: { entityType: "inventory", wrappedReason: "Invalid quantity" },
            cause: quantityResult.error,
          })
        );
      }

      const reserveResult = stock.reserve(quantityResult.value);
      if (!isSuccess(reserveResult)) {
        await this.release(reservations);
        return this.#mapInventoryError(reserveResult.error, context);
      }

      reservations.push(reserveResult.value);

      const saveResult = await this.#stockRepository.save(stock);
      if (!isSuccess(saveResult)) {
        await this.release(reservations);
        return failure(
          new StorefrontError("internal_error", {
            details: {
              entityType: "inventory",
              entityId: stockId.toString(),
              wrappedCode: saveResult.error.code,
              ...(saveResult.error.meta.reason !== undefined
                ? { wrappedReason: saveResult.error.meta.reason }
                : {}),
            },
            cause: saveResult.error,
          })
        );
      }
    }

    return success(reservations);
  }

  async release(reservations: readonly Reservation[]): Promise<void> {
    for (const reservation of reservations) {
      const stockId = StockId.create(reservation.sku, reservation.warehouseId);
      const stockResult = await this.#stockRepository.getById(stockId);
      if (!isSuccess(stockResult)) {
        continue;
      }
      if (stockResult.value === null) {
        continue;
      }

      const stock = stockResult.value;
      const releaseResult = stock.release(reservation.quantity);
      if (isSuccess(releaseResult)) {
        await this.#stockRepository.save(stock);
      }
    }
  }

  async commit(
    reservations: readonly Reservation[],
    context: PurchaseContext
  ): Promise<Result<void, StorefrontError>> {
    const committedReservations: Reservation[] = [];

    for (const reservation of reservations) {
      const stockId = StockId.create(reservation.sku, reservation.warehouseId);
      const stockResult = await this.#stockRepository.getById(stockId);

      if (!isSuccess(stockResult)) {
        await this.release(committedReservations);
        return failure(
          new StorefrontError("internal_error", {
            details: {
              entityType: "inventory",
              entityId: stockId.toString(),
              wrappedCode: stockResult.error.code,
              ...(stockResult.error.meta.reason !== undefined
                ? { wrappedReason: stockResult.error.meta.reason }
                : {}),
            },
            cause: stockResult.error,
          })
        );
      }

      if (stockResult.value === null) {
        await this.release(committedReservations);
        return failure(
          new StorefrontError("internal_error", {
            details: {
              entityType: "inventory",
              entityId: stockId.toString(),
              wrappedReason: "Stock not found during commit",
            },
          })
        );
      }

      const stock = stockResult.value;
      const commitResult = stock.commit(reservation.quantity);
      if (!isSuccess(commitResult)) {
        await this.release(committedReservations);
        return this.#mapInventoryError(commitResult.error, context);
      }

      committedReservations.push(reservation);

      const saveResult = await this.#stockRepository.save(stock);
      if (!isSuccess(saveResult)) {
        await this.release(committedReservations);
        return failure(
          new StorefrontError("internal_error", {
            details: {
              entityType: "inventory",
              entityId: stockId.toString(),
              wrappedCode: saveResult.error.code,
              ...(saveResult.error.meta.reason !== undefined
                ? { wrappedReason: saveResult.error.meta.reason }
                : {}),
            },
            cause: saveResult.error,
          })
        );
      }
    }

    return success(undefined);
  }

  #mapInventoryError(
    error: InventoryError,
    context: PurchaseContext
  ): Result<never, StorefrontError> {
    const reason = error.meta.reason;

    switch (reason) {
      case "insufficient_stock": {
        const details: StorefrontErrorMeta["details"] = {
          entityType: "inventory",
          wrappedCode: error.code,
          wrappedReason: reason,
          ...(error.meta.details?.sku !== undefined ? { entityId: error.meta.details.sku } : {}),
          ...(error.meta.details !== undefined ? { details: error.meta.details } : {}),
        };
        return failure(new StorefrontError("invalid_input", { details, cause: error }));
      }
      case "invalid_quantity":
        return failure(
          new StorefrontError("invalid_input", {
            details: {
              entityType: "inventory",
              wrappedCode: error.code,
              wrappedReason: reason,
              ...(error.meta.details !== undefined ? { details: error.meta.details } : {}),
            },
            cause: error,
          })
        );
      default:
        return failure(
          new StorefrontError("internal_error", {
            details: {
              entityType: "inventory",
              wrappedCode: error.code,
              ...(error.meta.details !== undefined ? { details: error.meta.details } : {}),
            },
            cause: error,
          })
        );
    }
  }
}
