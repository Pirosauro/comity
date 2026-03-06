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
      meta: {},
      timestamp: now.toISOString(),
    });
  });

  it("should include httpStatus when present in meta", () => {
    const error = new TestError("Resource not found", { httpStatus: 404 });
    const payload = toSafePayload(error);

    expect(payload.httpStatus).toBe(404);
    expect(payload.meta).toEqual({});
  });

  it("should include all optional fields when meta contains all properties", () => {
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
      httpStatus: 500,
      meta: {
        reason: "internal_server_error",
        detail: "Unexpected condition encountered",
        retriable: false,
      },
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
      meta: {},
      timestamp,
    });
  });

  it("should generate valid ISO timestamp", () => {
    const error = new TestError("Test timestamp generation", {});
    const payload = toSafePayload(error);

    expect(() => new Date(payload.timestamp)).not.toThrow();
  });
});
