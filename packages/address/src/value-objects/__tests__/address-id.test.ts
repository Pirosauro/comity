import { describe, expect, it } from "vitest";
import { AddressId } from "../address-id.js";

describe("AddressId", () => {
  it("should create with value", () => {
    const id = new AddressId("abc-123");

    expect(id.toString()).toBe("abc-123");
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
});