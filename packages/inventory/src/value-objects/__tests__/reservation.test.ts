import { describe, expect, it } from "vitest";
import { isFailure } from "@comity/primitives/result";
import { Quantity } from "../quantity.js";
import { Reservation } from "../reservation.js";
import { Sku } from "../sku.js";
import { WarehouseId } from "../warehouse-id.js";

function sku(value: string): Sku {
  const result = Sku.create(value);

  if (isFailure(result)) {
    throw new Error("Unexpected failure");
  }

  return result.value;
}

function warehouseId(value: string): WarehouseId {
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

describe("Reservation", () => {
  it("should create with a SKU, a warehouse, and a quantity", () => {
    const reservation = Reservation.create(sku("sku-1"), warehouseId("wh-1"), qty(5n, 0));

    expect(reservation.sku.toString()).toBe("sku-1");
    expect(reservation.warehouseId.toString()).toBe("wh-1");
    expect(reservation.quantity.equals(qty(5n, 0))).toBe(true);
  });

  it("should create without a failure path", () => {
    const reservation = Reservation.create(sku("sku-1"), warehouseId("wh-1"), qty(0n, 0));

    expect(reservation.quantity.equals(qty(0n, 0))).toBe(true);
  });

  it("should equal another reservation with the same SKU, warehouse, and quantity", () => {
    const a = Reservation.create(sku("sku-1"), warehouseId("wh-1"), qty(5n, 0));
    const b = Reservation.create(sku("sku-1"), warehouseId("wh-1"), qty(5n, 0));

    expect(a.equals(b)).toBe(true);
  });

  it("should not equal a reservation with a different quantity", () => {
    const a = Reservation.create(sku("sku-1"), warehouseId("wh-1"), qty(5n, 0));
    const b = Reservation.create(sku("sku-1"), warehouseId("wh-1"), qty(6n, 0));

    expect(a.equals(b)).toBe(false);
  });

  it("should not equal a reservation with a different SKU", () => {
    const a = Reservation.create(sku("sku-1"), warehouseId("wh-1"), qty(5n, 0));
    const b = Reservation.create(sku("sku-2"), warehouseId("wh-1"), qty(5n, 0));

    expect(a.equals(b)).toBe(false);
  });

  it("should not equal a reservation with a different warehouse", () => {
    const a = Reservation.create(sku("sku-1"), warehouseId("wh-1"), qty(5n, 0));
    const b = Reservation.create(sku("sku-1"), warehouseId("wh-2"), qty(5n, 0));

    expect(a.equals(b)).toBe(false);
  });

  it("should not expose lifecycle states or transitions", () => {
    const reservation = Reservation.create(sku("sku-1"), warehouseId("wh-1"), qty(5n, 0));
    const members = reservation as unknown as Record<string, unknown>;

    expect(members["status"]).toBeUndefined();
    expect(members["confirm"]).toBeUndefined();
    expect(members["release"]).toBeUndefined();
    expect(members["cancel"]).toBeUndefined();
    expect(members["expire"]).toBeUndefined();
    expect(members["createdAt"]).toBeUndefined();
    expect(members["expiresAt"]).toBeUndefined();
  });

  it("should return a stable technical serialization", () => {
    const reservation = Reservation.create(sku("sku-1"), warehouseId("wh-1"), qty(5n, 0));

    expect(reservation.toString()).toBe("wh-1:sku-1 5 scale 0");
  });

  it("should not allow bypassing construction through the constructor", () => {
    // @ts-expect-error the constructor is private; creation goes through create()
    new Reservation(sku("sku-1"), warehouseId("wh-1"), qty(5n, 0));
  });
});