import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { TestError } from "../../__mocks__/error.js";
import { toSafePayload } from "../to-safe-payload";

describe("toSafePayload", () => {
  let now: Date;

  beforeEach(() => {
    now = new Date("2024-01-15T10:30:00Z");

    vi.useFakeTimers();
    vi.setSystemTime(now);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should convert BaseError with required fields only", () => {
    const error = new TestError("Input validation failed");
    const payload = toSafePayload(error);

    expect(payload).toEqual({
      code: "test:error",
      message: "Input validation failed",
      timestamp: now.toISOString(),
    });
  });

  it("should include httpStatus when present in meta", () => {
    const error = new TestError("Resource not found", { httpStatus: 404 });
    const payload = toSafePayload(error);

    expect(payload.httpStatus).toBe(404);
    expect(payload.context).toEqual(undefined);
  });

  it("should not include fields outside context", () => {
    const timestamp = now.toISOString();
    const error = new TestError("Complex error occurred", {
      httpStatus: 500,
      reason: "internal_server_error",
      detail: "Unexpected condition encountered",
      retriable: false,
      timestamp,
    });
    const payload = toSafePayload(error);

    expect(payload).toEqual({
      code: "test:error",
      message: "Complex error occurred",
      reason: "internal_server_error",
      httpStatus: 500,
      timestamp,
    });
  });

  it("should ignore non-matching types in meta", () => {
    const timestamp = now.toISOString();
    const error = new TestError("Type mismatch occurred", {
      httpStatus: "404",
      timestamp,
    });
    const payload = toSafePayload(error);

    expect(payload).toEqual({
      code: "test:error",
      message: "Type mismatch occurred",
      timestamp,
    });
  });

  it("should generate valid ISO timestamp", () => {
    const error = new TestError("Test timestamp generation", {});
    const payload = toSafePayload(error);

    expect(() => new Date(payload.timestamp!)).not.toThrow();
  });

  it("should handle error with no meta object", () => {
    const error = new TestError("Simple error");
    const payload = toSafePayload(error);

    expect(payload.code).toBe("test:error");
    expect(payload.message).toBe("Simple error");
    expect(payload.timestamp).toBeDefined();
  });

  it("should include reason field when present", () => {
    const error = new TestError("Error with reason", {
      reason: "invalid_input",
    });
    const payload = toSafePayload(error);

    expect(payload.reason).toBe("invalid_input");
  });

  it("should exclude non-string reason field", () => {
    const error = new TestError("Error with wrong reason type", {
      reason: 123,
    });
    const payload = toSafePayload(error);

    expect(payload.reason).toBeUndefined();
  });

  it("should include context with simple object", () => {
    const error = new TestError("Error with context", {
      context: { key: "value", count: 42 },
    });
    const payload = toSafePayload(error);

    expect(payload.context).toEqual({ key: "value", count: 42 });
  });

  it("should include context with nested objects", () => {
    const error = new TestError("Error with nested context", {
      context: { outer: { inner: "value", number: 100 } },
    });
    const payload = toSafePayload(error);

    expect(payload.context).toEqual({ outer: { inner: "value", number: 100 } });
  });

  it("should include context with arrays", () => {
    const error = new TestError("Error with array context", {
      context: { items: [1, 2, 3], names: ["a", "b"] },
    });
    const payload = toSafePayload(error);

    expect(payload.context).toEqual({
      items: [1, 2, 3],
      names: ["a", "b"],
    });
  });

  it("should include context with boolean values", () => {
    const error = new TestError("Error with boolean context", {
      context: { isValid: true, isError: false },
    });
    const payload = toSafePayload(error);

    expect(payload.context).toEqual({ isValid: true, isError: false });
  });

  it("should include context with null values", () => {
    const error = new TestError("Error with null context", {
      context: { nullable: null, value: "test" },
    });
    const payload = toSafePayload(error);

    expect(payload.context).toEqual({ nullable: null, value: "test" });
  });

  it("should exclude context with non-JSON values", () => {
    const error = new TestError("Error with invalid context", {
      context: {
        valid: "string",
        invalid: undefined,
        func: () => {},
      },
    });
    const payload = toSafePayload(error);

    expect(payload.context).toEqual({ valid: "string" });
  });

  it("should exclude non-object context", () => {
    const error = new TestError("Error with non-object context", {
      context: "not an object",
    });
    const payload = toSafePayload(error);

    expect(payload.context).toBeUndefined();
  });

  it("should handle context with nested arrays containing objects", () => {
    const error = new TestError("Error with complex context", {
      context: {
        data: [
          { id: 1, name: "first" },
          { id: 2, name: "second" },
        ],
      },
    });
    const payload = toSafePayload(error);

    expect(payload.context).toEqual({
      data: [
        { id: 1, name: "first" },
        { id: 2, name: "second" },
      ],
    });
  });

  it("should handle context with mixed primitive types in arrays", () => {
    const error = new TestError("Error with mixed array", {
      context: { mixed: [1, "string", true, null] },
    });
    const payload = toSafePayload(error);

    expect(payload.context).toEqual({ mixed: [1, "string", true, null] });
  });

  it("should exclude context with non-JSON values in nested structure", () => {
    const error = new TestError("Error with invalid nested context", {
      context: {
        outer: {
          valid: "value",
          invalid: undefined,
          alsoInvalid: Symbol("test"),
        },
      },
    });
    const payload = toSafePayload(error);

    expect(payload.context).toEqual({});
  });

  it("should exclude arrays with non-JSON values", () => {
    const error = new TestError("Error with invalid array", {
      context: {
        items: [1, 2, undefined, "valid"],
      },
    });
    const payload = toSafePayload(error);

    expect(payload.context).toEqual({});
  });

  it("should include all valid fields together", () => {
    const error = new TestError("Complete error", {
      httpStatus: 422,
      reason: "validation_failed",
      context: {
        field: "email",
        expected: "valid email",
        received: "invalid",
      },
    });
    const payload = toSafePayload(error);

    expect(payload).toEqual({
      code: "test:error",
      message: "Complete error",
      httpStatus: 422,
      reason: "validation_failed",
      context: {
        field: "email",
        expected: "valid email",
        received: "invalid",
      },
      timestamp: now.toISOString(),
    });
  });

  it("should handle context with deeply nested structure", () => {
    const error = new TestError("Error with deep nesting", {
      context: {
        level1: {
          level2: {
            level3: {
              value: "deep",
              number: 42,
            },
          },
        },
      },
    });
    const payload = toSafePayload(error);

    expect(payload.context).toEqual({
      level1: {
        level2: {
          level3: {
            value: "deep",
            number: 42,
          },
        },
      },
    });
  });

  it("should exclude context when it contains non-JSON at any depth", () => {
    const error = new TestError("Error with deep invalid value", {
      context: {
        level1: {
          level2: {
            invalid: () => {},
          },
        },
      },
    });
    const payload = toSafePayload(error);

    expect(payload.context).toEqual({});
  });

  it("should handle empty context object", () => {
    const error = new TestError("Error with empty context", {
      context: {},
    });
    const payload = toSafePayload(error);

    expect(payload.context).toEqual({});
  });

  it("should handle context object with only non-JSON values", () => {
    const error = new TestError("Error with all invalid context", {
      context: {
        func: () => {},
        undef: undefined,
        sym: Symbol("test"),
      },
    });
    const payload = toSafePayload(error);

    expect(payload.context).toEqual({});
  });

  it("should preserve zero and false values in context", () => {
    const error = new TestError("Error with falsy values", {
      context: {
        zero: 0,
        emptyString: "",
        false: false,
        null: null,
      },
    });
    const payload = toSafePayload(error);

    expect(payload.context).toEqual({
      zero: 0,
      emptyString: "",
      false: false,
      null: null,
    });
  });

  it("should exclude context with arrays containing non-JSON values", () => {
    const error = new TestError("Error with polluted array", {
      context: {
        items: [1, 2, { valid: "object", invalid: () => {} }],
      },
    });
    const payload = toSafePayload(error);

    expect(payload.context).toEqual({});
  });
});
