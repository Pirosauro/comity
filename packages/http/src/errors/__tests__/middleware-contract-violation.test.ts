import { describe, expect, it } from "vitest";
import { HttpMiddlewareContractViolationError } from "../middleware-contract-violation.js";

describe("HttpMiddlewareContractViolationError", () => {
  it("should create error with message", () => {
    const error = new HttpMiddlewareContractViolationError("Middleware violation occurred");

    expect(error.message).toBe("Middleware violation occurred");
    expect(error.code).toBe("http:middleware-contract-violation");
    expect(error.name).toBe("HttpMiddlewareContractViolationError");
    expect(error.meta.httpStatus).toBe(500);
  });

  it("should create error with message and metadata", () => {
    const meta = { middleware: "auth", reason: "next called twice" };
    const error = new HttpMiddlewareContractViolationError("Contract violated", meta);

    expect(error.message).toBe("Contract violated");
    expect(error.meta.middleware).toBe("auth");
    expect(error.meta.reason).toBe("next called twice");
    expect(error.meta.httpStatus).toBe(500);
  });

  it("should be instanceof Error", () => {
    const error = new HttpMiddlewareContractViolationError("Test error");

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(HttpMiddlewareContractViolationError);
  });

  it("should have correct stack trace", () => {
    const error = new HttpMiddlewareContractViolationError("Test error");

    expect(error.stack).toBeDefined();
    expect(error.stack).toContain("HttpMiddlewareContractViolationError");
  });

  it("should handle empty metadata", () => {
    const error = new HttpMiddlewareContractViolationError("Error message");

    expect(error.meta).toHaveProperty("httpStatus");
    expect(error.meta.httpStatus).toBe(500);
  });

  it("should preserve custom metadata", () => {
    const meta = { custom: "value", nested: { key: "data" } };
    const error = new HttpMiddlewareContractViolationError("Message", meta);

    expect(error.meta.custom).toBe("value");
    expect(error.meta.nested).toEqual({ key: "data" });
  });

  it("should maintain httpStatus as 500 even with custom metadata", () => {
    const meta = { someField: "value" };
    const error = new HttpMiddlewareContractViolationError("Message", meta);

    expect(error.meta.httpStatus).toBe(500);
  });
});
