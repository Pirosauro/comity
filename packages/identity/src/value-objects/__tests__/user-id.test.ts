import { describe, expect, it } from "vitest";
import { UserId } from "../user-id.js";

describe("UserId", () => {
  it("should create with value", () => {
    const id = new UserId("usr-123");

    expect(id.toString()).toBe("usr-123");
  });

  it("should equal same value", () => {
    const a = new UserId("usr-1");
    const b = new UserId("usr-1");

    expect(a.equals(b)).toBe(true);
  });

  it("should not equal different value", () => {
    const a = new UserId("usr-1");
    const b = new UserId("usr-2");

    expect(a.equals(b)).toBe(false);
  });
});