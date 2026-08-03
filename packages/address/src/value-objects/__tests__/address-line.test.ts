import { describe, expect, it } from "vitest";
import { AddressLine } from "../address-line.js";

describe("AddressLine", () => {
  it("should create with value", () => {
    const line = new AddressLine("Via Roma 10");

    expect(line.toString()).toBe("Via Roma 10");
  });

  it("should equal same value", () => {
    const a = new AddressLine("line");
    const b = new AddressLine("line");

    expect(a.equals(b)).toBe(true);
  });

  it("should not equal different value", () => {
    const a = new AddressLine("A");
    const b = new AddressLine("B");

    expect(a.equals(b)).toBe(false);
  });
});