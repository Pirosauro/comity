import type { StockCreate } from "../../contracts/stock.js";

import { describe, expect, it } from "vitest";
import { isFailure } from "@comity/primitives/result";
import { Instant } from "@comity/primitives/time";
import { InventoryError } from "../../errors/inventory.js";
import { Quantity } from "../../value-objects/quantity.js";
import { Reservation } from "../../value-objects/reservation.js";
import { Sku } from "../../value-objects/sku.js";
import { StockId } from "../../value-objects/stock-id.js";
import { WarehouseId } from "../../value-objects/warehouse-id.js";
import { Stock } from "../stock.js";

function makeSku(value: string): Sku {
  const result = Sku.create(value);

  if (isFailure(result)) {
    throw new Error("Unexpected failure");
  }

  return result.value;
}

function makeWarehouseId(value: string): WarehouseId {
  const result = WarehouseId.create(value);

  if (isFailure(result)) {
    throw new Error("Unexpected failure");
  }

  return result.value;
}

function qty(value: bigint, scale: number): Quantity {
  const result = Quantity.create(value, scale);

  if (isFailure(result)) {
    throw new Error("Unexpected failure");
  }

  return result.value;
}

const sku = makeSku("sku-1");
const warehouseId = makeWarehouseId("wh-1");

const fields: StockCreate = {
  sku,
  warehouseId,
  onHand: qty(100n, 0),
  reserved: qty(20n, 0),
  createdAt: Instant.fromEpochMilliseconds(123456789),
};

function createStock(overrides?: Partial<StockCreate>) {
  return new Stock({ ...fields, ...overrides }, StockId.create(sku, warehouseId));
}

describe("Stock", () => {
  describe("creation", () => {
    it("should initialize all fields correctly", () => {
      const stock = createStock();

      expect(stock.sku.toString()).toBe("sku-1");
      expect(stock.warehouseId.toString()).toBe("wh-1");
      expect(stock.onHand.equals(qty(100n, 0))).toBe(true);
      expect(stock.reserved.equals(qty(20n, 0))).toBe(true);
      expect(stock.createdAt).toBeInstanceOf(Instant);
      expect(stock.updatedAt).toBeInstanceOf(Instant);
    });

    it("should derive the id from the SKU and warehouse when not provided", () => {
      const stock = new Stock(fields);

      expect(stock.id.equals(StockId.create(sku, warehouseId))).toBe(true);
    });

    it("should accept an explicit id", () => {
      const stock = createStock();

      expect(stock.id.toString()).toBe("wh-1:sku-1");
    });

    it("should default updatedAt to createdAt", () => {
      const stock = new Stock(fields);

      expect(stock.updatedAt.epochMilliseconds).toBe(stock.createdAt.epochMilliseconds);
    });

    it("should accept explicit createdAt", () => {
      const now = Instant.now();
      const stock = new Stock({ ...fields, createdAt: now });

      expect(stock.createdAt.epochMilliseconds).toBe(now.epochMilliseconds);
    });
  });

  describe("availability", () => {
    it("should derive available as on-hand minus reserved", () => {
      const stock = createStock();
      const result = stock.availability();

      expect(isFailure(result)).toBe(false);
      if (!isFailure(result)) {
        expect(result.value.onHand.equals(qty(100n, 0))).toBe(true);
        expect(result.value.reserved.equals(qty(20n, 0))).toBe(true);
        expect(result.value.available.equals(qty(80n, 0))).toBe(true);
      }
    });

    it("should stay coherent with the stock after mutations", () => {
      const stock = createStock();
      stock.increase(qty(50n, 0));
      stock.reserve(qty(30n, 0));

      const result = stock.availability();

      expect(isFailure(result)).toBe(false);
      if (!isFailure(result)) {
        expect(result.value.onHand.equals(stock.onHand)).toBe(true);
        expect(result.value.reserved.equals(stock.reserved)).toBe(true);
        expect(result.value.available.equals(stock.onHand.subtract(stock.reserved).value)).toBe(
          true
        );
      }
    });

    it("should fail with invalid_quantity when a hydrated record violates the invariant", () => {
      const stock = createStock({ onHand: qty(10n, 0), reserved: qty(20n, 0) });
      const result = stock.availability();

      expect(isFailure(result)).toBe(true);
      if (isFailure(result)) {
        expect(result.error).toBeInstanceOf(InventoryError);
        expect(result.error.meta.reason).toBe("invalid_quantity");
      }
    });
  });

  describe("increase", () => {
    it("should add to the amount on hand", () => {
      const stock = createStock();
      const result = stock.increase(qty(5n, 0));

      expect(isFailure(result)).toBe(false);
      expect(stock.onHand.equals(qty(105n, 0))).toBe(true);
    });

    it("should preserve the reserved amount", () => {
      const stock = createStock();
      stock.increase(qty(5n, 0));

      expect(stock.reserved.equals(qty(20n, 0))).toBe(true);
    });

    it("should update updatedAt", () => {
      const stock = createStock();
      const before = stock.updatedAt.epochMilliseconds;

      stock.increase(qty(5n, 0));

      expect(stock.updatedAt.epochMilliseconds).toBeGreaterThanOrEqual(before);
    });
  });

  describe("decrease", () => {
    it("should decrease the amount on hand", () => {
      const stock = createStock();
      const result = stock.decrease(qty(5n, 0));

      expect(isFailure(result)).toBe(false);
      expect(stock.onHand.equals(qty(95n, 0))).toBe(true);
    });

    it("should fail with insufficient_stock when the quantity exceeds availability", () => {
      const stock = createStock();
      const result = stock.decrease(qty(81n, 0));

      expect(isFailure(result)).toBe(true);
      if (isFailure(result)) {
        expect(result.error).toBeInstanceOf(InventoryError);
        expect(result.error.meta.reason).toBe("insufficient_stock");
      }
    });

    it("should leave the stock unchanged when the decrease fails", () => {
      const stock = createStock();
      stock.decrease(qty(81n, 0));

      expect(stock.onHand.equals(qty(100n, 0))).toBe(true);
      expect(stock.reserved.equals(qty(20n, 0))).toBe(true);
    });
  });

  describe("reserve", () => {
    it("should return a reservation for the requested quantity", () => {
      const stock = createStock();
      const result = stock.reserve(qty(10n, 0));

      expect(isFailure(result)).toBe(false);
      if (!isFailure(result)) {
        expect(result.value.sku.toString()).toBe("sku-1");
        expect(result.value.warehouseId.toString()).toBe("wh-1");
        expect(result.value.quantity.equals(qty(10n, 0))).toBe(true);
      }
    });

    it("should commit the quantity to the reserved amount", () => {
      const stock = createStock();
      stock.reserve(qty(10n, 0));

      expect(stock.reserved.equals(qty(30n, 0))).toBe(true);
    });

    it("should reduce availability without changing the amount on hand", () => {
      const stock = createStock();
      stock.reserve(qty(10n, 0));

      const result = stock.availability();

      expect(isFailure(result)).toBe(false);
      if (!isFailure(result)) {
        expect(result.value.available.equals(qty(70n, 0))).toBe(true);
      }
      expect(stock.onHand.equals(qty(100n, 0))).toBe(true);
    });

    it("should fail with insufficient_stock when the quantity exceeds availability", () => {
      const stock = createStock();
      const result = stock.reserve(qty(81n, 0));

      expect(isFailure(result)).toBe(true);
      if (isFailure(result)) {
        expect(result.error).toBeInstanceOf(InventoryError);
        expect(result.error.meta.reason).toBe("insufficient_stock");
        expect(result.error.meta.details?.sku).toBe("sku-1");
        expect(result.error.meta.details?.warehouseId).toBe("wh-1");
      }
    });

    it("should never allow reserved to exceed on hand", () => {
      const stock = createStock();
      stock.reserve(qty(80n, 0));
      stock.reserve(qty(1n, 0));

      expect(stock.reserved.compare(stock.onHand)).toBeLessThanOrEqual(0);
      expect(stock.reserved.equals(qty(100n, 0))).toBe(true);
    });

    it("should support fractional quantities", () => {
      const stock = createStock({ onHand: qty(2500n, 3), reserved: qty(0n, 0) });
      const result = stock.reserve(qty(500n, 3));

      expect(isFailure(result)).toBe(false);
      expect(stock.reserved.equals(qty(500n, 3))).toBe(true);

      const availability = stock.availability();

      expect(isFailure(availability)).toBe(false);
      if (!isFailure(availability)) {
        expect(availability.value.available.equals(qty(2000n, 3))).toBe(true);
      }
    });
  });

  describe("release", () => {
    it("should return the released quantity to available stock", () => {
      const stock = createStock();
      const reservationResult = stock.reserve(qty(30n, 0));

      expect(isFailure(reservationResult)).toBe(false);

      const result = stock.release(qty(30n, 0));

      expect(isFailure(result)).toBe(false);
      expect(stock.reserved.equals(qty(20n, 0))).toBe(true);

      const availability = stock.availability();

      expect(isFailure(availability)).toBe(false);
      if (!isFailure(availability)) {
        expect(availability.value.available.equals(qty(80n, 0))).toBe(true);
      }
    });

    it("should fail with invalid_quantity when releasing more than reserved", () => {
      const stock = createStock();
      const result = stock.release(qty(21n, 0));

      expect(isFailure(result)).toBe(true);
      if (isFailure(result)) {
        expect(result.error).toBeInstanceOf(InventoryError);
        expect(result.error.meta.reason).toBe("invalid_quantity");
        expect(result.error.meta.details?.field).toBe("quantity");
      }
    });

    it("should leave the stock unchanged when the release fails", () => {
      const stock = createStock();
      stock.release(qty(21n, 0));

      expect(stock.reserved.equals(qty(20n, 0))).toBe(true);
    });

    it("should never allow the reserved amount to go negative", () => {
      const stock = createStock({ reserved: qty(0n, 0) });
      stock.release(qty(1n, 0));

      expect(stock.reserved.compare(qty(0n, 0))).toBeGreaterThanOrEqual(0);
    });
  });

  describe("snapshot", () => {
    it("should include the id and all fields", () => {
      const stock = createStock();
      const snapshot = stock.snapshot();

      expect(snapshot.id.toString()).toBe("wh-1:sku-1");
      expect(snapshot.sku.toString()).toBe("sku-1");
      expect(snapshot.warehouseId.toString()).toBe("wh-1");
      expect(snapshot.onHand.equals(qty(100n, 0))).toBe(true);
      expect(snapshot.reserved.equals(qty(20n, 0))).toBe(true);
      expect(snapshot.createdAt).toBeInstanceOf(Instant);
      expect(snapshot.updatedAt).toBeInstanceOf(Instant);
    });

    it("should not persist the derived availability", () => {
      const stock = createStock();
      const snapshot = stock.snapshot() as unknown as Record<string, unknown>;

      expect(snapshot["available"]).toBeUndefined();
      expect(snapshot["availability"]).toBeUndefined();
    });

    it("should include capturedAt", () => {
      const stock = createStock();

      expect(stock.snapshot().capturedAt).toBeInstanceOf(Instant);
    });

    it("should be immutable after mutation of source", () => {
      const stock = createStock();
      const snapshot = stock.snapshot();

      stock.increase(qty(50n, 0));

      expect(snapshot.onHand.equals(qty(100n, 0))).toBe(true);
    });

    it("should return a new object each call", () => {
      const stock = createStock();

      expect(stock.snapshot()).not.toBe(stock.snapshot());
    });
  });

  describe("reservation value type", () => {
    it("should return reservations without lifecycle states", () => {
      const stock = createStock();
      const result = stock.reserve(qty(10n, 0));

      expect(isFailure(result)).toBe(false);
      if (!isFailure(result)) {
        const reservation: Reservation = result.value;
        const members = reservation as unknown as Record<string, unknown>;

        expect(members["status"]).toBeUndefined();
        expect(members["confirm"]).toBeUndefined();
        expect(members["cancel"]).toBeUndefined();
        expect(members["expire"]).toBeUndefined();
      }
    });
  });

  describe("commit", () => {
    it("should reduce both reserved and on-hand when the quantity is reserved", () => {
      const stock = createStock();

      const result = stock.commit(qty(5n, 0));

      expect(isFailure(result)).toBe(false);
      expect(stock.reserved.equals(qty(15n, 0))).toBe(true);
      expect(stock.onHand.equals(qty(95n, 0))).toBe(true);
    });

    it("should fail with insufficient_stock when no quantity is reserved for the commit", () => {
      const stock = createStock();

      const result = stock.commit(qty(21n, 0));

      expect(isFailure(result)).toBe(true);
      if (isFailure(result)) {
        expect(result.error).toBeInstanceOf(InventoryError);
        expect(result.error.meta.reason).toBe("insufficient_stock");
      }
    });

    it("should leave the stock unchanged when the commit fails", () => {
      const stock = createStock();

      stock.commit(qty(21n, 0));

      expect(stock.reserved.equals(qty(20n, 0))).toBe(true);
      expect(stock.onHand.equals(qty(100n, 0))).toBe(true);
    });

    it("should be safe to call twice with the same quantity", () => {
      const stock = createStock();

      const first = stock.commit(qty(5n, 0));
      const second = stock.commit(qty(5n, 0));

      expect(isFailure(first)).toBe(false);
      expect(isFailure(second)).toBe(true);
      if (isFailure(second)) {
        expect(second.error.meta.reason).toBe("insufficient_stock");
      }
      expect(stock.reserved.equals(qty(15n, 0))).toBe(true);
      expect(stock.onHand.equals(qty(95n, 0))).toBe(true);
    });
  });
});