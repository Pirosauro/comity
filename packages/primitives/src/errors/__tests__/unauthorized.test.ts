import { describe, expect, it } from "vitest";
import { UnauthorizedError } from "../unauthorized.js";

describe("UnauthorizedError", () => {
  it("should create error with default message", () => {
    const error = new UnauthorizedError("Authentication required");

    expect(error.message).toBe("Authentication required");
    expect(error.code).toBe("core:unauthorized");
    expect(error.name).toBe("UnauthorizedError");
    expect(error.meta.httpStatus).toBe(401);
  });

  it("should create error with custom message", () => {
    const error = new UnauthorizedError("Custom unauthorized message");

    expect(error.message).toBe("Custom unauthorized message");
    expect(error.code).toBe("core:unauthorized");
    expect(error.meta.httpStatus).toBe(401);
  });

  it("should include additional metadata", () => {
    const error = new UnauthorizedError("Invalid token", {
      authType: "Bearer",
      realm: "api",
      challenge: 'Bearer realm="api"',
    });

    expect(error.meta.authType).toBe("Bearer");
    expect(error.meta.realm).toBe("api");
    expect(error.meta.challenge).toBe('Bearer realm="api"');
    expect(error.meta.httpStatus).toBe(401);
  });

  it("should be instanceof Error", () => {
    const error = new UnauthorizedError("Test");

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(UnauthorizedError);
  });

  it("should have correct stack trace", () => {
    const error = new UnauthorizedError("Test");

    expect(error.stack).toBeDefined();
    expect(error.stack).toContain("UnauthorizedError");
  });
});
