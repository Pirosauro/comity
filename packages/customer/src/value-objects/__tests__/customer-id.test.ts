import { describe, expect, it } from "vitest";
import { CustomerId } from "../customer-id.js";

describe("CustomerId", () => {
  it("should create with value", () => {
    const id = new CustomerId("cust-123");

    expect(id.toString()).toBe("cust-123");
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
});