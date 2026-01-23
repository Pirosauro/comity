import { describe, expect, it } from "vitest";
import { InvalidInputError } from "../invalid-input.js";

describe("InvalidInputError", () => {
  it("should create error with default message", () => {
    const error = new InvalidInputError();

    expect(error.message).toBe("Invalid input");
    expect(error.code).toBe("core:invalid-input");
    expect(error.name).toBe("InvalidInputError");
    expect(error.meta.httpStatus).toBe(400);
  });

  it("should create error with custom message", () => {
    const error = new InvalidInputError("Custom validation message");

    expect(error.message).toBe("Custom validation message");
    expect(error.code).toBe("core:invalid-input");
    expect(error.meta.httpStatus).toBe(400);
  });

  it("should include additional metadata", () => {
    const error = new InvalidInputError("Invalid input", {
      field: "username",
      rule: "required",
    });

    expect(error.meta.field).toBe("username");
    expect(error.meta.rule).toBe("required");
    expect(error.meta.httpStatus).toBe(400);
  });

  it("should be instanceof Error", () => {
    const error = new InvalidInputError("Test");

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(InvalidInputError);
  });

  it("should have correct stack trace", () => {
    const error = new InvalidInputError("Test");

    expect(error.stack).toBeDefined();
    expect(error.stack).toContain("InvalidInputError");
  });
});
