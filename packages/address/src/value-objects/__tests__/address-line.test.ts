import { describe, expect, it } from "vitest";
import { isFailure } from "@comity/primitives/result";
import { AddressLine } from "../address-line.js";

function line(value: string): AddressLine {
  const result = AddressLine.create(value);

  if (isFailure(result)) {
    throw new Error("Unexpected failure");
  }

  return result.value;
}

describe("AddressLine", () => {
  it("should create with value", () => {
    const addressLine = line("Via Roma 10");

    expect(addressLine.toString()).toBe("Via Roma 10");
  });

  it("should equal same value", () => {
    const a = line("line");
    const b = line("line");

    expect(a.equals(b)).toBe(true);
  });

  it("should not equal different value", () => {
    const a = line("A");
    const b = line("B");

    expect(a.equals(b)).toBe(false);
  });

  it("should not allow bypassing validation through the constructor", () => {
    // @ts-expect-error the constructor is private; creation goes through create()
    new AddressLine("anything");
  });
});