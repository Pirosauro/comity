import { describe, expect, it } from "vitest";
import { isFailure } from "@comity/primitives/result";
import { InvalidIdentifierError } from "@comity/primitives/errors";
import { Sku } from "../sku.js";

function sku(value: string): Sku {
  const result = Sku.create(value);

  if (isFailure(result)) {
    throw new Error("Unexpected failure");
  }

  return result.value;
}

describe("Sku", () => {
  it("should create with a value", () => {
    const stockKeepingUnit = sku("sku-123");

    expect(stockKeepingUnit.value).toBe("sku-123");
    expect(stockKeepingUnit.toString()).toBe("sku-123");
  });

  it("should preserve the original value when non-empty", () => {
    const stockKeepingUnit = sku("  sku-with-spaces  ");

    expect(stockKeepingUnit.value).toBe("  sku-with-spaces  ");
    expect(stockKeepingUnit.toString()).toBe("  sku-with-spaces  ");
  });

  it("should equal same value", () => {
    const a = sku("sku-1");
    const b = sku("sku-1");

    expect(a.equals(b)).toBe(true);
  });

  it("should not equal different value", () => {
    const a = sku("sku-1");
    const b = sku("sku-2");

    expect(a.equals(b)).toBe(false);
  });

  it("should reject an empty string with InvalidIdentifierError", () => {
    const result = Sku.create("");

    expect(isFailure(result)).toBe(true);
    if (isFailure(result)) {
      expect(result.error).toBeInstanceOf(InvalidIdentifierError);
    }
  });

  it("should reject a whitespace-only string with InvalidIdentifierError", () => {
    const result = Sku.create("   ");

    expect(isFailure(result)).toBe(true);
    if (isFailure(result)) {
      expect(result.error).toBeInstanceOf(InvalidIdentifierError);
    }
  });

  it("should expose the kind in InvalidIdentifierError details", () => {
    const result = Sku.create("");

    expect(isFailure(result)).toBe(true);
    if (isFailure(result)) {
      expect(result.error.meta.details.kind).toBe("Sku");
    }
  });

  it("should not allow bypassing validation through the constructor", () => {
    // @ts-expect-error the constructor is private; creation goes through create()
    new Sku("anything");
  });
});