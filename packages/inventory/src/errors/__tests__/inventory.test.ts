import { describe, expect, it } from "vitest";
import { InventoryError } from "../inventory.js";

describe("InventoryError", () => {
  it("creates an error with the invalid_quantity reason", () => {
    const error = new InventoryError("invalid_quantity");

    expect(error.code).toBe("inventory:invalid_quantity");
    expect(error.message).toBe("Invalid quantity");
    expect(error.meta.reason).toBe("invalid_quantity");
    expect(error.meta.httpStatus).toBe(400);
  });

  it("creates an error with the insufficient_stock reason", () => {
    const error = new InventoryError("insufficient_stock");

    expect(error.code).toBe("inventory:insufficient_stock");
    expect(error.message).toBe("Insufficient stock");
    expect(error.meta.reason).toBe("insufficient_stock");
    expect(error.meta.httpStatus).toBe(409);
  });

  it("merges contextual details", () => {
    const error = new InventoryError("insufficient_stock", {
      details: { sku: "sku-1", warehouseId: "wh-1" },
    });

    expect(error.meta.details).toEqual({
      sku: "sku-1",
      warehouseId: "wh-1",
    });
  });

  it("merges field details", () => {
    const error = new InventoryError("invalid_quantity", {
      details: { field: "quantity" },
    });

    expect(error.meta.details).toEqual({ field: "quantity" });
  });

  it("overrides httpStatus with custom metadata", () => {
    const error = new InventoryError("insufficient_stock", { httpStatus: 503 });

    expect(error.meta.httpStatus).toBe(503);
  });

  it("is an instance of Error", () => {
    const error = new InventoryError("insufficient_stock");

    expect(error).toBeInstanceOf(Error);
  });
});