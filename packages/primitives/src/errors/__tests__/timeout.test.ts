import { describe, expect, it } from "vitest";
import { TimeoutError } from "../timeout.js";

describe("TimeoutError", () => {
  it("should create error with default message", () => {
    const error = new TimeoutError();

    expect(error.message).toBe("Operation timed out");
    expect(error.code).toBe("core:timeout");
    expect(error.name).toBe("TimeoutError");
    expect(error.meta.httpStatus).toBe(408);
  });

  it("should create error with custom message", () => {
    const error = new TimeoutError("Custom timeout message");

    expect(error.message).toBe("Custom timeout message");
    expect(error.code).toBe("core:timeout");
    expect(error.meta.httpStatus).toBe(408);
  });

  it("should include additional metadata", () => {
    const error = new TimeoutError("Timeout occurred", {
      operation: "fetch",
      timeoutMs: 5000,
    });

    expect(error.meta.operation).toBe("fetch");
    expect(error.meta.timeoutMs).toBe(5000);
    expect(error.meta.httpStatus).toBe(408);
  });

  it("should be instanceof Error", () => {
    const error = new TimeoutError("Test");

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(TimeoutError);
  });

  it("should have correct stack trace", () => {
    const error = new TimeoutError("Test");

    expect(error.stack).toBeDefined();
    expect(error.stack).toContain("TimeoutError");
  });
});
