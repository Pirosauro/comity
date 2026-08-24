import { describe, expect, it } from "vitest";
import { isFailure } from "@comity/primitives/result";
import { InvalidIdentifierError } from "@comity/primitives/errors";
import { AddressId } from "../address-id.js";

function id(value: string): AddressId {
  const result = AddressId.create(value);

  if (isFailure(result)) {
    throw new Error("Unexpected failure");
  }

  return result.value;
}

describe("AddressId", () => {
  it("should create with a value", () => {
    const addressId = id("abc-123");

    expect(addressId.value).toBe("abc-123");
    expect(addressId.toString()).toBe("abc-123");
  });

  it("should preserve the original value when non-empty", () => {
    const addressId = id("  addr-with-spaces  ");

    expect(addressId.value).toBe("  addr-with-spaces  ");
    expect(addressId.toString()).toBe("  addr-with-spaces  ");
  });

  it("should equal same value", () => {
    const a = id("id-1");
    const b = id("id-1");

    expect(a.equals(b)).toBe(true);
  });

  it("should not equal different value", () => {
    const a = id("id-1");
    const b = id("id-2");

    expect(a.equals(b)).toBe(false);
  });

  it("should reject an empty string with InvalidIdentifierError", () => {
    const result = AddressId.create("");

    expect(isFailure(result)).toBe(true);
    if (isFailure(result)) {
      expect(result.error).toBeInstanceOf(InvalidIdentifierError);
    }
  });

  it("should reject a whitespace-only string with InvalidIdentifierError", () => {
    const result = AddressId.create("   ");

    expect(isFailure(result)).toBe(true);
    if (isFailure(result)) {
      expect(result.error).toBeInstanceOf(InvalidIdentifierError);
    }
  });

  it("should expose the kind in InvalidIdentifierError details", () => {
    const result = AddressId.create("");

    expect(isFailure(result)).toBe(true);
    if (isFailure(result)) {
      expect(result.error.meta.details.kind).toBe("AddressId");
    }
  });

  it("should not allow bypassing validation through the constructor", () => {
    // @ts-expect-error the constructor is private; creation goes through create()
    new AddressId("anything");
  });
});