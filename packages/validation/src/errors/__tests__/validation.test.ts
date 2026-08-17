import { describe, expect, it } from "vitest";
import { ValidationError } from "../validation.js";

describe("ValidationError", () => {
  it("creates an error with the failed reason", () => {
    const error = new ValidationError("failed");

    expect(error.code).toBe("validation:failed");
    expect(error.message).toBe("Validation failed");
    expect(error.meta.reason).toBe("failed");
  });

  it("merges field details", () => {
    const error = new ValidationError("failed", {
      details: {
        fields: {
          email: [{ code: "required" }, { code: "format" }],
          name: [{ code: "required" }],
        },
      },
    });

    expect(error.meta.details?.fields).toEqual({
      email: [{ code: "required" }, { code: "format" }],
      name: [{ code: "required" }],
    });
  });

  it("is an instance of Error", () => {
    const error = new ValidationError("failed");

    expect(error).toBeInstanceOf(Error);
  });
});