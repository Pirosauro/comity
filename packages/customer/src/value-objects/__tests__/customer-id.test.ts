import { describe, expect, it } from "vitest";
import { isFailure } from "@comity/primitives/result";
import { InvalidIdentifierError } from "@comity/primitives/errors";
import { CustomerId } from "../customer-id.js";

function id(value: string): CustomerId {
  const result = CustomerId.create(value);

  if (isFailure(result)) {
    throw new Error("Unexpected failure");
  }

  return result.value;
}

describe("CustomerId", () => {
  it("should create with a value", () => {
    const customerId = id("cust-123");

    expect(customerId.value).toBe("cust-123");
    expect(customerId.toString()).toBe("cust-123");
  });

  it("should preserve the original value when non-empty", () => {
    const customerId = id("  cust-with-spaces  ");

    expect(customerId.value).toBe("  cust-with-spaces  ");
    expect(customerId.toString()).toBe("  cust-with-spaces  ");
  });

  it("should equal same value", () => {
    const a = id("cust-1");
    const b = id("cust-1");

    expect(a.equals(b)).toBe(true);
  });

  it("should not equal different value", () => {
    const a = id("cust-1");
    const b = id("cust-2");

    expect(a.equals(b)).toBe(false);
  });

  it("should reject an empty string with InvalidIdentifierError", () => {
    const result = CustomerId.create("");

    expect(isFailure(result)).toBe(true);
    if (isFailure(result)) {
      expect(result.error).toBeInstanceOf(InvalidIdentifierError);
    }
  });

  it("should reject a whitespace-only string with InvalidIdentifierError", () => {
    const result = CustomerId.create("   ");

    expect(isFailure(result)).toBe(true);
    if (isFailure(result)) {
      expect(result.error).toBeInstanceOf(InvalidIdentifierError);
    }
  });

  it("should expose the kind in InvalidIdentifierError details", () => {
    const result = CustomerId.create("");

    expect(isFailure(result)).toBe(true);
    if (isFailure(result)) {
      expect(result.error.meta.details.kind).toBe("CustomerId");
    }
  });

  it("should not allow bypassing validation through the constructor", () => {
    // @ts-expect-error the constructor is private; creation goes through create()
    new CustomerId("anything");
  });
});