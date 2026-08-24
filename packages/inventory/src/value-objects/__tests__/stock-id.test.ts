import { describe, expect, it } from "vitest";
import { isFailure } from "@comity/primitives/result";
import { Sku } from "../sku.js";
import { StockId } from "../stock-id.js";
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

describe("StockId", () => {
  it("should create from a SKU and a warehouse", () => {
    const stockId = StockId.create(sku("sku-1"), warehouseId("wh-1"));

    expect(stockId.sku.toString()).toBe("sku-1");
    expect(stockId.warehouseId.toString()).toBe("wh-1");
    expect(stockId.toString()).toBe("wh-1:sku-1");
  });

  it("should equal the same SKU and warehouse", () => {
    const a = StockId.create(sku("sku-1"), warehouseId("wh-1"));
    const b = StockId.create(sku("sku-1"), warehouseId("wh-1"));

    expect(a.equals(b)).toBe(true);
  });

  it("should not equal a different SKU", () => {
    const a = StockId.create(sku("sku-1"), warehouseId("wh-1"));
    const b = StockId.create(sku("sku-2"), warehouseId("wh-1"));

    expect(a.equals(b)).toBe(false);
  });

  it("should not equal a different warehouse", () => {
    const a = StockId.create(sku("sku-1"), warehouseId("wh-1"));
    const b = StockId.create(sku("sku-1"), warehouseId("wh-2"));

    expect(a.equals(b)).toBe(false);
  });

  it("should not allow bypassing construction through the constructor", () => {
    // @ts-expect-error the constructor is private; creation goes through create()
    new StockId(sku("sku-1"), warehouseId("wh-1"));
  });
});