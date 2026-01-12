import { describe, expect, it } from "vitest";
import { isSuccess, success } from "../success.js";

describe("success", () => {
  it("should create a success result with value", () => {
    const result = success("test value");

    expect(result).toEqual({
      success: true,
      value: "test value",
    });
  });

  it("should create a success result with value and meta", () => {
    const result = success(42, { timestamp: 1234567890 });

    expect(result).toEqual({
      success: true,
      value: 42,
      meta: { timestamp: 1234567890 },
    });
  });

  it("should handle different value types", () => {
    expect(success("string")).toEqual({ success: true, value: "string" });
    expect(success(123)).toEqual({ success: true, value: 123 });
    expect(success({ key: "value" })).toEqual({
      success: true,
      value: { key: "value" },
    });
    expect(success([1, 2, 3])).toEqual({ success: true, value: [1, 2, 3] });
    expect(success(null)).toEqual({ success: true, value: null });
    expect(success(undefined)).toEqual({ success: true, value: undefined });
  });

  it("should handle empty meta", () => {
    const result = success("value", {});

    expect(result).toEqual({
      success: true,
      value: "value",
      meta: {},
    });
  });

  it("should handle complex meta", () => {
    const meta = {
      timestamp: Date.now(),
      userId: "123",
      metadata: { nested: true },
    };
    const result = success("data", meta);

    expect(result.meta).toBe(meta);
  });
});

describe("isSuccess", () => {
  it("should return true for success results", () => {
    const result = success("test");

    expect(isSuccess(result)).toBe(true);
  });

  it("should return false for failure results", () => {
    expect(isSuccess({ success: false, error: new Error("test") as any })).toBe(
      false,
    );
  });

  it("should narrow types correctly", () => {
    const result = success("test value");

    if (isSuccess(result)) {
      // TypeScript should know result.value exists
      expect(result.value).toBe("test value");
      expect(result.success).toBe(true);
    }
  });

  it("should work with results that have meta", () => {
    const result = success("value", { key: "meta" });

    if (isSuccess(result)) {
      expect(result.value).toBe("value");
      expect(result.meta).toEqual({ key: "meta" });
    }
  });
});
