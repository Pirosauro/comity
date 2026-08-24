import { describe, expect, it } from "vitest";
import { isFailure } from "@comity/primitives/result";
import { InventoryError } from "../../errors/inventory.js";
import { Quantity } from "../quantity.js";

function qty(value: bigint, scale: number): Quantity {
  const result = Quantity.create(value, scale);

  if (isFailure(result)) {
    throw new Error("Unexpected failure");
  }

  return result.value;
}

describe("Quantity", () => {
  it("should create with a value and a scale", () => {
    const quantity = qty(2500n, 3);

    expect(quantity.value).toBe(2500n);
    expect(quantity.scale).toBe(3);
  });

  it("should allow a zero value", () => {
    const quantity = qty(0n, 0);

    expect(quantity.value).toBe(0n);
    expect(quantity.scale).toBe(0);
  });

  it("should reject a negative value with InventoryError", () => {
    const result = Quantity.create(-1n, 0);

    expect(isFailure(result)).toBe(true);
    if (isFailure(result)) {
      expect(result.error).toBeInstanceOf(InventoryError);
      expect(result.error.meta.reason).toBe("invalid_quantity");
      expect(result.error.meta.details?.field).toBe("value");
    }
  });

  it("should reject a negative scale with InventoryError", () => {
    const result = Quantity.create(1n, -1);

    expect(isFailure(result)).toBe(true);
    if (isFailure(result)) {
      expect(result.error).toBeInstanceOf(InventoryError);
      expect(result.error.meta.reason).toBe("invalid_quantity");
      expect(result.error.meta.details?.field).toBe("scale");
    }
  });

  it("should reject a fractional scale with InventoryError", () => {
    const result = Quantity.create(1n, 1.5);

    expect(isFailure(result)).toBe(true);
    if (isFailure(result)) {
      expect(result.error.meta.reason).toBe("invalid_quantity");
      expect(result.error.meta.details?.field).toBe("scale");
    }
  });

  it("should equal another quantity with the same value and scale", () => {
    expect(qty(10n, 0).equals(qty(10n, 0))).toBe(true);
  });

  it("should equal another quantity with a different scale", () => {
    expect(qty(2500n, 3).equals(qty(250n, 2))).toBe(true);
  });

  it("should not equal a different quantity", () => {
    expect(qty(10n, 0).equals(qty(11n, 0))).toBe(false);
  });

  it("should add quantities with the same scale", () => {
    expect(qty(10n, 0).add(qty(5n, 0)).equals(qty(15n, 0))).toBe(true);
  });

  it("should add quantities with different scales", () => {
    expect(qty(2500n, 3).add(qty(25n, 1)).equals(qty(5000n, 3))).toBe(true);
  });

  it("should subtract quantities with the same scale", () => {
    const result = qty(10n, 0).subtract(qty(3n, 0));

    expect(isFailure(result)).toBe(false);
    if (!isFailure(result)) {
      expect(result.value.equals(qty(7n, 0))).toBe(true);
    }
  });

  it("should subtract quantities with different scales", () => {
    const result = qty(2500n, 3).subtract(qty(25n, 1));

    expect(isFailure(result)).toBe(false);
    if (!isFailure(result)) {
      expect(result.value.equals(qty(0n, 3))).toBe(true);
    }
  });

  it("should reject a subtraction that would be negative", () => {
    const result = qty(3n, 0).subtract(qty(10n, 0));

    expect(isFailure(result)).toBe(true);
    if (isFailure(result)) {
      expect(result.error).toBeInstanceOf(InventoryError);
      expect(result.error.meta.reason).toBe("invalid_quantity");
      expect(result.error.meta.details?.field).toBe("value");
    }
  });

  it("should compare smaller quantities", () => {
    expect(qty(3n, 0).compare(qty(10n, 0))).toBe(-1);
  });

  it("should compare equal quantities across scales", () => {
    expect(qty(2500n, 3).compare(qty(250n, 2))).toBe(0);
  });

  it("should compare larger quantities", () => {
    expect(qty(10n, 0).compare(qty(3n, 0))).toBe(1);
  });

  it("should return a stable technical serialization", () => {
    expect(qty(2500n, 3).toString()).toBe("2500 scale 3");
  });

  it("should not allow bypassing validation through the constructor", () => {
    // @ts-expect-error the constructor is private; creation goes through create()
    new Quantity(10n, 0);
  });
});