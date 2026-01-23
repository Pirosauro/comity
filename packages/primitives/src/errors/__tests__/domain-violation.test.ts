import { describe, expect, it } from "vitest";
import { DomainViolationError } from "../domain-violation.js";

describe("DomainViolationError", () => {
  it("should create error with default message", () => {
    const error = new DomainViolationError();

    expect(error.message).toBe("Domain invariants violated");
    expect(error.code).toBe("core:domain-violation");
    expect(error.name).toBe("DomainViolationError");
    expect(error.meta.httpStatus).toBe(422);
  });

  it("should create error with custom message", () => {
    const error = new DomainViolationError("Custom domain violation message");

    expect(error.message).toBe("Custom domain violation message");
    expect(error.code).toBe("core:domain-violation");
    expect(error.meta.httpStatus).toBe(422);
  });

  it("should include additional metadata", () => {
    const error = new DomainViolationError("Invalid data", {
      field: "email",
      reason: "invalid format",
    });

    expect(error.meta.field).toBe("email");
    expect(error.meta.reason).toBe("invalid format");
    expect(error.meta.httpStatus).toBe(422);
  });

  it("should be instanceof Error", () => {
    const error = new DomainViolationError("Test");

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(DomainViolationError);
  });

  it("should have correct stack trace", () => {
    const error = new DomainViolationError("Test");

    expect(error.stack).toBeDefined();
    expect(error.stack).toContain("DomainViolationError");
  });
});
