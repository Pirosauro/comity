import type { Result } from "@comity/primitives/result";
import type { StockCreate, StockSnapshot } from "../contracts/stock.js";
import type { Quantity } from "../value-objects/quantity.js";
import type { Sku } from "../value-objects/sku.js";
import type { WarehouseId } from "../value-objects/warehouse-id.js";

import { failure, isFailure, success } from "@comity/primitives/result";
import { Instant } from "@comity/primitives/time";
import { InventoryError } from "../errors/inventory.js";
import { Availability } from "../value-objects/availability.js";
import { Reservation } from "../value-objects/reservation.js";
import { StockId } from "../value-objects/stock-id.js";

/**
 * Represents the stock record of a single SKU in a single warehouse.
 *
 * @remark
 * A Stock is an aggregate: it owns its quantities and preserves the
 * invariants `onHand >= 0`, `reserved >= 0`, and `reserved <= onHand`
 * through every mutation. It does not validate products, does not know
 * pricing, and does not orchestrate reservations — releasing a reservation
 * is a quantity mutation on the stock; orchestration between stock and the
 * parties that reserved it belongs to application/domain services.
 */
export class Stock {
  readonly #id: StockId;
  #sku: Sku;
  #warehouseId: WarehouseId;
  #onHand: Quantity;
  #reserved: Quantity;
  readonly #createdAt: Instant;
  #updatedAt: Instant;

  /**
   * @param fields - The fields used to create or hydrate the stock record.
   * @param id - The unique identifier of the stock record. Defaults to the
   * identity derived from the SKU and warehouse.
   */
  constructor(fields: StockCreate, id?: StockId) {
    this.#id = id ?? StockId.create(fields.sku, fields.warehouseId);
    this.#sku = fields.sku;
    this.#warehouseId = fields.warehouseId;
    this.#onHand = fields.onHand;
    this.#reserved = fields.reserved;
    this.#createdAt = fields.createdAt ?? Instant.now();
    this.#updatedAt = fields.updatedAt ?? this.#createdAt;
  }

  /**
   * @returns The unique identifier of the stock record.
   */
  get id(): StockId {
    return this.#id;
  }

  /**
   * @returns The stock-keeping unit.
   */
  get sku(): Sku {
    return this.#sku;
  }

  /**
   * @returns The warehouse the stock belongs to.
   */
  get warehouseId(): WarehouseId {
    return this.#warehouseId;
  }

  /**
   * @returns The total physical quantity on hand.
   */
  get onHand(): Quantity {
    return this.#onHand;
  }

  /**
   * @returns The quantity committed to active reservations.
   */
  get reserved(): Quantity {
    return this.#reserved;
  }

  /**
   * @returns The timestamp when the stock record was created.
   */
  get createdAt(): Instant {
    return this.#createdAt;
  }

  /**
   * @returns The timestamp when the stock record was last updated.
   */
  get updatedAt(): Instant {
    return this.#updatedAt;
  }

  /**
   * Returns the current availability: the derived view of what this stock
   * can provide (`available = onHand - reserved`).
   *
   * The invariants are preserved by every mutation, but a failure is still
   * returned when a hydrated record violates them instead of throwing.
   *
   * @returns The availability, or an `invalid_quantity` error when the
   * reserved amount exceeds the amount on hand.
   */
  availability(): Result<Availability, InventoryError> {
    return this.#availability();
  }

  /**
   * Increases the amount on hand.
   *
   * @param quantity - The quantity to add.
   *
   * @returns A result indicating the success of the increase.
   */
  increase(quantity: Quantity): Result<void, InventoryError> {
    this.#onHand = this.#onHand.add(quantity);
    this.#updatedAt = Instant.now();

    return success(undefined);
  }

  /**
   * Decreases the amount on hand.
   *
   * @param quantity - The quantity to remove.
   *
   * @returns A result indicating the success or failure of the decrease.
   */
  decrease(quantity: Quantity): Result<void, InventoryError> {
    const availability = this.#availability();

    if (isFailure(availability)) {
      return availability;
    }

    if (availability.value.available.compare(quantity) < 0) {
      return failure(
        new InventoryError("insufficient_stock", {
          details: {
            sku: this.#sku.toString(),
            warehouseId: this.#warehouseId.toString(),
          },
        })
      );
    }

    const result = this.#onHand.subtract(quantity);

    if (isFailure(result)) {
      return result;
    }

    this.#onHand = result.value;
    this.#updatedAt = Instant.now();

    return success(undefined);
  }

  /**
   * Reserves a quantity, committing it to active reservations.
   *
   * The returned Reservation represents a quantity that is already reserved:
   * it has no lifecycle and no confirmation step.
   *
   * @param quantity - The quantity to reserve.
   *
   * @returns The reservation, or an `insufficient_stock` error when the
   * available amount cannot cover the requested quantity.
   */
  reserve(quantity: Quantity): Result<Reservation, InventoryError> {
    const availability = this.#availability();

    if (isFailure(availability)) {
      return availability;
    }

    if (availability.value.available.compare(quantity) < 0) {
      return failure(
        new InventoryError("insufficient_stock", {
          details: {
            sku: this.#sku.toString(),
            warehouseId: this.#warehouseId.toString(),
          },
        })
      );
    }

    this.#reserved = this.#reserved.add(quantity);
    this.#updatedAt = Instant.now();

    return success(Reservation.create(this.#sku, this.#warehouseId, quantity));
  }

  /**
   * Releases a previously reserved quantity back to available stock.
   *
   * @param quantity - The quantity to release.
   *
   * @returns A result indicating the success or failure of the release.
   */
  release(quantity: Quantity): Result<void, InventoryError> {
    if (this.#reserved.compare(quantity) < 0) {
      return failure(
        new InventoryError("invalid_quantity", {
          details: {
            field: "quantity",
            sku: this.#sku.toString(),
            warehouseId: this.#warehouseId.toString(),
          },
        })
      );
    }

    const result = this.#reserved.subtract(quantity);

    if (isFailure(result)) {
      return result;
    }

    this.#reserved = result.value;
    this.#updatedAt = Instant.now();

    return success(undefined);
  }

  /**
   * Commits a reserved quantity: converts the held reservation into a
   * definitive consumption by reducing both the reserved and on-hand
   * quantities.
   *
   * Semantically equivalent to `release(q)` followed by `decrease(q)` but
   * performed atomically with a single precondition: the quantity must be
   * currently reserved. A repeat call with the same quantity fails with
   * `insufficient_stock` and does not mutate state, which preserves
   * inventory integrity under double-commit.
   *
   * @param quantity - The quantity to commit.
   *
   * @returns A result indicating the success or failure of the commit.
   */
  commit(quantity: Quantity): Result<void, InventoryError> {
    if (this.#reserved.compare(quantity) < 0) {
      return failure(
        new InventoryError("insufficient_stock", {
          details: {
            sku: this.#sku.toString(),
            warehouseId: this.#warehouseId.toString(),
          },
        })
      );
    }

    const reservedResult = this.#reserved.subtract(quantity);

    if (isFailure(reservedResult)) {
      return reservedResult;
    }

    this.#reserved = reservedResult.value;

    const onHandResult = this.#onHand.subtract(quantity);

    if (isFailure(onHandResult)) {
      return onHandResult;
    }

    this.#onHand = onHandResult.value;
    this.#updatedAt = Instant.now();

    return success(undefined);
  }

  /**
   * Creates a snapshot of the current state of the stock record.
   *
   * @returns A snapshot representing the current state of the stock record.
   */
  snapshot(): StockSnapshot {
    return {
      id: this.#id,
      sku: this.#sku,
      warehouseId: this.#warehouseId,
      onHand: this.#onHand,
      reserved: this.#reserved,
      createdAt: this.#createdAt,
      updatedAt: this.#updatedAt,
      capturedAt: Instant.now(),
    };
  }

  /**
   * Computes the current availability.
   *
   * @returns The availability, or an `invalid_quantity` error when the
   * reserved amount exceeds the amount on hand.
   */
  #availability(): Result<Availability, InventoryError> {
    return Availability.create(this.#onHand, this.#reserved);
  }
}