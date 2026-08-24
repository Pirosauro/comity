import { describe, expect, it } from "vitest";
import { isFailure } from "@comity/primitives/result";
import { InvalidIdentifierError } from "@comity/primitives/errors";
import { OrderId } from "../order-id.js";

function id(value: string): OrderId {
  const result = OrderId.create(value);

  if (isFailure(result)) {
    throw new Error("Unexpected failure");
  }

  return result.value;
}

describe("OrderId", () => {
  it("should create with a value", () => {
    const orderId = id("order-123");

    expect(orderId.value).toBe("order-123");
    expect(orderId.toString()).toBe("order-123");
  });

  it("should preserve the original value when non-empty", () => {
    const orderId = id("  order-with-spaces  ");

    expect(orderId.value).toBe("  order-with-spaces  ");
    expect(orderId.toString()).toBe("  order-with-spaces  ");
  });

  it("should equal same value", () => {
    const a = id("order-1");
    const b = id("order-1");

    expect(a.equals(b)).toBe(true);
  });

  it("should not equal different value", () => {
    const a = id("order-1");
    const b = id("order-2");

    expect(a.equals(b)).toBe(false);
  });

  it("should reject an empty string with InvalidIdentifierError", () => {
    const result = OrderId.create("");

    expect(isFailure(result)).toBe(true);
    if (isFailure(result)) {
      expect(result.error).toBeInstanceOf(InvalidIdentifierError);
    }
  });

  it("should reject a whitespace-only string with InvalidIdentifierError", () => {
    const result = OrderId.create("   ");

    expect(isFailure(result)).toBe(true);
    if (isFailure(result)) {
      expect(result.error).toBeInstanceOf(InvalidIdentifierError);
    }
  });

  it("should expose the kind in InvalidIdentifierError details", () => {
    const result = OrderId.create("");

    expect(isFailure(result)).toBe(true);
    if (isFailure(result)) {
      expect(result.error.meta.details.kind).toBe("OrderId");
    }
  });

  it("should not allow bypassing validation through the constructor", () => {
    // @ts-expect-error the constructor is private; creation goes through create()
    new OrderId("anything");
  });
});