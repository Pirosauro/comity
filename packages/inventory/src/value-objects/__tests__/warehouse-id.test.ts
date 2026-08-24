import { describe, expect, it } from "vitest";
import { isFailure } from "@comity/primitives/result";
import { InvalidIdentifierError } from "@comity/primitives/errors";
import { WarehouseId } from "../warehouse-id.js";

function warehouseId(value: string): WarehouseId {
  const result = WarehouseId.create(value);

  if (isFailure(result)) {
    throw new Error("Unexpected failure");
  }

  return result.value;
}

describe("WarehouseId", () => {
  it("should create with a value", () => {
    const id = warehouseId("wh-1");

    expect(id.value).toBe("wh-1");
    expect(id.toString()).toBe("wh-1");
  });

  it("should preserve the original value when non-empty", () => {
    const id = warehouseId("  wh-with-spaces  ");

    expect(id.value).toBe("  wh-with-spaces  ");
    expect(id.toString()).toBe("  wh-with-spaces  ");
  });

  it("should equal same value", () => {
    const a = warehouseId("wh-1");
    const b = warehouseId("wh-1");

    expect(a.equals(b)).toBe(true);
  });

  it("should not equal different value", () => {
    const a = warehouseId("wh-1");
    const b = warehouseId("wh-2");

    expect(a.equals(b)).toBe(false);
  });

  it("should reject an empty string with InvalidIdentifierError", () => {
    const result = WarehouseId.create("");

    expect(isFailure(result)).toBe(true);
    if (isFailure(result)) {
      expect(result.error).toBeInstanceOf(InvalidIdentifierError);
    }
  });

  it("should reject a whitespace-only string with InvalidIdentifierError", () => {
    const result = WarehouseId.create("   ");

    expect(isFailure(result)).toBe(true);
    if (isFailure(result)) {
      expect(result.error).toBeInstanceOf(InvalidIdentifierError);
    }
  });

  it("should expose the kind in InvalidIdentifierError details", () => {
    const result = WarehouseId.create("");

    expect(isFailure(result)).toBe(true);
    if (isFailure(result)) {
      expect(result.error.meta.details.kind).toBe("WarehouseId");
    }
  });

  it("should not allow bypassing validation through the constructor", () => {
    // @ts-expect-error the constructor is private; creation goes through create()
    new WarehouseId("anything");
  });
});