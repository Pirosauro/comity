import { describe, expect, it } from "vitest";
import { BadRequestError } from "../bad-request.js";

describe("BadRequestError", () => {
  it("should create error with default message", () => {
    const error = new BadRequestError("Invalid request");

    expect(error.message).toBe("Invalid request");
    expect(error.code).toBe("core:bad_request");
    expect(error.name).toBe("BadRequestError");
    expect(error.meta.httpStatus).toBe(400);
  });

  it("should create error with custom message", () => {
    const error = new BadRequestError("Custom bad request message");

    expect(error.message).toBe("Custom bad request message");
    expect(error.code).toBe("core:bad_request");
    expect(error.meta.httpStatus).toBe(400);
  });

  it("should include additional metadata", () => {
    const error = new BadRequestError("Invalid data", {
      field: "email",
      value: "invalid-email",
      validation: "email format",
    });

    expect(error.meta.field).toBe("email");
    expect(error.meta.value).toBe("invalid-email");
    expect(error.meta.validation).toBe("email format");
    expect(error.meta.httpStatus).toBe(400);
  });

  it("should be instanceof Error", () => {
    const error = new BadRequestError("Test");

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(BadRequestError);
  });

  it("should have correct stack trace", () => {
    const error = new BadRequestError("Test");

    expect(error.stack).toBeDefined();
    expect(error.stack).toContain("BadRequestError");
  });
});
