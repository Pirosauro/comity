import { describe, expect, it } from "vitest";
import { TestError } from "../../__mocks__/error.js";
import { failure, isFailure } from "../failure.js";

describe("failure", () => {
  it("should create a failure result", () => {
    const error = new TestError("Test error");
    const result = failure(error);

    expect(result).toEqual({
      success: false,
      error,
    });
  });

  it("should work with different error types", () => {
    const error = new Error("Generic error");
    const result = failure(error as any);

    expect(result.success).toBe(false);
    expect(result.error).toBe(error);
  });
});

describe("isFailure", () => {
  it("should return true for failure results", () => {
    const error = new TestError("Test");
    const result = failure(error);

    expect(isFailure(result)).toBe(true);
  });

  it("should return false for success results", () => {
    expect(isFailure({ success: true, value: "test" })).toBe(false);
  });

  it("should narrow types correctly", () => {
    const error = new TestError("Test");
    const result = failure(error);

    if (isFailure(result)) {
      // TypeScript should know result.error exists
      expect(result.error).toBe(error);
      expect(result.success).toBe(false);
    }
  });
});
