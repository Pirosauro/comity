import { describe, expect, it } from "vitest";
import { ForbiddenError } from "../forbidden.js";

describe("ForbiddenError", () => {
  it("should create error with default message", () => {
    const error = new ForbiddenError("Access denied");

    expect(error.message).toBe("Access denied");
    expect(error.code).toBe("core:forbidden");
    expect(error.name).toBe("ForbiddenError");
    expect(error.meta.httpStatus).toBe(403);
  });

  it("should create error with custom message", () => {
    const error = new ForbiddenError("Custom forbidden message");

    expect(error.message).toBe("Custom forbidden message");
    expect(error.code).toBe("core:forbidden");
    expect(error.meta.httpStatus).toBe(403);
  });

  it("should include additional metadata", () => {
    const error = new ForbiddenError("Insufficient permissions", {
      requiredRole: "admin",
      userRole: "user",
      resource: "user:123",
    });

    expect(error.meta.requiredRole).toBe("admin");
    expect(error.meta.userRole).toBe("user");
    expect(error.meta.resource).toBe("user:123");
    expect(error.meta.httpStatus).toBe(403);
  });

  it("should be instanceof Error", () => {
    const error = new ForbiddenError("Test");

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(ForbiddenError);
  });

  it("should have correct stack trace", () => {
    const error = new ForbiddenError("Test");

    expect(error.stack).toBeDefined();
    expect(error.stack).toContain("ForbiddenError");
  });
});
