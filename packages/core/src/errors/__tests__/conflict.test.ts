import { describe, expect, it } from "vitest";
import { ConflictError } from "../conflict.js";

describe("ConflictError", () => {
  it("should create error with default message", () => {
    const error = new ConflictError("Resource conflict");

    expect(error.message).toBe("Resource conflict");
    expect(error.code).toBe("core:conflict");
    expect(error.name).toBe("ConflictError");
    expect(error.meta.httpStatus).toBe(409);
  });

  it("should create error with custom message", () => {
    const error = new ConflictError("Custom conflict message");

    expect(error.message).toBe("Custom conflict message");
    expect(error.code).toBe("core:conflict");
    expect(error.meta.httpStatus).toBe(409);
  });

  it("should include additional metadata", () => {
    const error = new ConflictError("Conflict occurred", {
      resource: "user",
      id: "123",
    });

    expect(error.meta.resource).toBe("user");
    expect(error.meta.id).toBe("123");
    expect(error.meta.httpStatus).toBe(409);
  });

  it("should be instanceof Error", () => {
    const error = new ConflictError("Test");

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(ConflictError);
  });

  it("should have correct stack trace", () => {
    const error = new ConflictError("Test");

    expect(error.stack).toBeDefined();
    expect(error.stack).toContain("ConflictError");
  });
});
