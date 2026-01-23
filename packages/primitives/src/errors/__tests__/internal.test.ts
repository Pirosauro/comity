import { describe, expect, it } from "vitest";
import { InternalError } from "../internal.js";

describe("InternalError", () => {
  it("should create error with default message", () => {
    const error = new InternalError("Internal server error");

    expect(error.message).toBe("Internal server error");
    expect(error.code).toBe("core:internal");
    expect(error.name).toBe("InternalError");
    expect(error.meta.httpStatus).toBe(500);
  });

  it("should create error with custom message", () => {
    const error = new InternalError("Custom internal error message");

    expect(error.message).toBe("Custom internal error message");
    expect(error.code).toBe("core:internal");
    expect(error.meta.httpStatus).toBe(500);
  });

  it("should include additional metadata", () => {
    const error = new InternalError("Database connection failed", {
      service: "database",
      operation: "connect",
      timeout: 5000,
    });

    expect(error.meta.service).toBe("database");
    expect(error.meta.operation).toBe("connect");
    expect(error.meta.timeout).toBe(5000);
    expect(error.meta.httpStatus).toBe(500);
  });

  it("should be instanceof Error", () => {
    const error = new InternalError("Test");

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(InternalError);
  });

  it("should have correct stack trace", () => {
    const error = new InternalError("Test");

    expect(error.stack).toBeDefined();
    expect(error.stack).toContain("InternalError");
  });
});
