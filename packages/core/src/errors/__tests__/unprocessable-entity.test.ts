import { describe, expect, it } from "vitest";
import { UnprocessableEntityError } from "../unprocessable-entity.js";

describe("UnprocessableEntityError", () => {
  it("should create error with default message", () => {
    const error = new UnprocessableEntityError();

    expect(error.message).toBe("Unprocessable Entity");
    expect(error.code).toBe("UNPROCESSABLE_ENTITY");
    expect(error.name).toBe("UnprocessableEntityError");
    expect(error.meta.httpStatus).toBe(422);
  });

  it("should create error with custom message", () => {
    const error = new UnprocessableEntityError("Custom unprocessable message");

    expect(error.message).toBe("Custom unprocessable message");
    expect(error.code).toBe("UNPROCESSABLE_ENTITY");
    expect(error.meta.httpStatus).toBe(422);
  });

  it("should include additional metadata", () => {
    const error = new UnprocessableEntityError("Invalid data", {
      field: "email",
      reason: "invalid format",
    });

    expect(error.meta.field).toBe("email");
    expect(error.meta.reason).toBe("invalid format");
    expect(error.meta.httpStatus).toBe(422);
  });

  it("should be instanceof Error", () => {
    const error = new UnprocessableEntityError("Test");

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(UnprocessableEntityError);
  });

  it("should have correct stack trace", () => {
    const error = new UnprocessableEntityError("Test");

    expect(error.stack).toBeDefined();
    expect(error.stack).toContain("UnprocessableEntityError");
  });
});
