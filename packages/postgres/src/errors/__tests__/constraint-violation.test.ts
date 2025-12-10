import { describe, it, expect } from "vitest";
import { ConstraintViolationError } from "../constraint-violation.js";

describe("ConstraintViolationError", () => {
  it("should create an error with default message", () => {
    const error = new ConstraintViolationError();

    expect(error).toBeInstanceOf(ConstraintViolationError);
    expect(error.message).toBe("Database constraint violation");
    expect(error.name).toBe("PostgresConstraintViolationError");
  });

  it("should create an error with custom message", () => {
    const customMessage = "Custom constraint violation message";
    const error = new ConstraintViolationError(customMessage);

    expect(error.message).toBe(customMessage);
    expect(error.name).toBe("PostgresConstraintViolationError");
  });

  it("should extend BadRequestError", () => {
    const error = new ConstraintViolationError();

    // Check that it has the properties of BadRequestError
    expect(error).toHaveProperty("status");
    expect(error.status).toBe(400); // Bad Request status code
  });

  it("should be instanceof Error", () => {
    const error = new ConstraintViolationError();

    expect(error).toBeInstanceOf(Error);
  });

  it("should have correct stack trace", () => {
    const error = new ConstraintViolationError();

    expect(error.stack).toBeDefined();
    expect(typeof error.stack).toBe("string");
    expect(error.stack).toContain("ConstraintViolationError");
  });
});
