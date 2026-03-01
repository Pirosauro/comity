import { describe, expect, it } from "vitest";
import { TestError } from "../../__mocks__/error.js";

describe("BaseError", () => {
  it("should create error with message", () => {
    const error = new TestError("test message");

    expect(error.message).toBe("test message");
    expect(error.code).toBe("test:error");
    expect(error.name).toBe("TestError");
    expect(error.meta).toEqual({});
  });

  it("should create error with metadata", () => {
    const error = new TestError("test message", {
      httpStatus: 400,
      details: { field: "invalid" },
    });

    expect(error.meta.httpStatus).toBe(400);
    expect(error.meta.details).toEqual({ field: "invalid" });
  });

  it("should handle cause in metadata", () => {
    const cause = new Error("original error");
    const error = new TestError("test message", { cause });

    expect(error.cause).toBe(cause);
    expect(error.meta.cause).toBeUndefined(); // cause should be removed from meta
  });

  it("should freeze metadata", () => {
    const error = new TestError("test", { details: { mutable: true } });

    expect(() => {
      (error.meta as any).newProp = "should fail";
    }).toThrow();
  });
});
