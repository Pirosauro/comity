import { describe, expect, it } from "vitest";
import { InvalidIdentifierError } from "@comity/primitives/errors";
import { AddressId } from "../address-id.js";

describe("AddressId", () => {
  it("should create with a value", () => {
    const id = new AddressId("abc-123");

    expect(id.value).toBe("abc-123");
    expect(id.toString()).toBe("abc-123");
  });

  it("should preserve the original value when non-empty", () => {
    const id = new AddressId("  addr-with-spaces  ");

    expect(id.value).toBe("  addr-with-spaces  ");
    expect(id.toString()).toBe("  addr-with-spaces  ");
  });

  it("should equal same value", () => {
    const a = new AddressId("id-1");
    const b = new AddressId("id-1");

    expect(a.equals(b)).toBe(true);
  });

  it("should not equal different value", () => {
    const a = new AddressId("id-1");
    const b = new AddressId("id-2");

    expect(a.equals(b)).toBe(false);
  });

  it("should reject an empty string with InvalidIdentifierError", () => {
    expect(() => new AddressId("")).toThrow(InvalidIdentifierError);
  });

  it("should reject a whitespace-only string with InvalidIdentifierError", () => {
    expect(() => new AddressId("   ")).toThrow(InvalidIdentifierError);
  });

  it("should expose the kind in InvalidIdentifierError details", () => {
    try {
      new AddressId("");
    } catch (error) {
      expect(error).toBeInstanceOf(InvalidIdentifierError);
      expect((error as InvalidIdentifierError).meta.details.kind).toBe("AddressId");
    }
  });
});
