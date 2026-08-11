import { describe, expect, it } from "vitest";
import { InvalidIdentifierError } from "@comity/primitives/errors";
import { CustomerId } from "../customer-id.js";

describe("CustomerId", () => {
  it("should create with a value", () => {
    const id = new CustomerId("cust-123");

    expect(id.value).toBe("cust-123");
    expect(id.toString()).toBe("cust-123");
  });

  it("should preserve the original value when non-empty", () => {
    const id = new CustomerId("  cust-with-spaces  ");

    expect(id.value).toBe("  cust-with-spaces  ");
    expect(id.toString()).toBe("  cust-with-spaces  ");
  });

  it("should equal same value", () => {
    const a = new CustomerId("cust-1");
    const b = new CustomerId("cust-1");

    expect(a.equals(b)).toBe(true);
  });

  it("should not equal different value", () => {
    const a = new CustomerId("cust-1");
    const b = new CustomerId("cust-2");

    expect(a.equals(b)).toBe(false);
  });

  it("should reject an empty string with InvalidIdentifierError", () => {
    expect(() => new CustomerId("")).toThrow(InvalidIdentifierError);
  });

  it("should reject a whitespace-only string with InvalidIdentifierError", () => {
    expect(() => new CustomerId("   ")).toThrow(InvalidIdentifierError);
  });

  it("should expose the kind in InvalidIdentifierError details", () => {
    try {
      new CustomerId("");
    } catch (error) {
      expect(error).toBeInstanceOf(InvalidIdentifierError);
      expect((error as InvalidIdentifierError).meta.details.kind).toBe("CustomerId");
    }
  });
});
