import { describe, expect, it } from "vitest";
import { ValidationError } from "../validation.js";

describe("ValidationError", () => {
  it("should create error with default message", () => {
    const error = new ValidationError();

    expect(error.message).toBe("Validation Error");
    expect(error.code).toBe("VALIDATION_ERROR");
    expect(error.name).toBe("ValidationError");
    expect(error.meta.httpStatus).toBe(400);
  });

  it("should create error with custom message", () => {
    const error = new ValidationError("Custom validation message");

    expect(error.message).toBe("Custom validation message");
    expect(error.code).toBe("VALIDATION_ERROR");
    expect(error.meta.httpStatus).toBe(400);
  });

  it("should include additional metadata", () => {
    const error = new ValidationError("Invalid input", {
      field: "username",
      rule: "required",
    });

    expect(error.meta.field).toBe("username");
    expect(error.meta.rule).toBe("required");
    expect(error.meta.httpStatus).toBe(400);
  });

  it("should be instanceof Error", () => {
    const error = new ValidationError("Test");

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(ValidationError);
  });

  it("should have correct stack trace", () => {
    const error = new ValidationError("Test");

    expect(error.stack).toBeDefined();
    expect(error.stack).toContain("ValidationError");
  });
});
