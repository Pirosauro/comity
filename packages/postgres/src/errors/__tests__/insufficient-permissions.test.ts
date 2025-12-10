import { describe, it, expect } from "vitest";
import { InsufficientPermissionsError } from "../insufficient-permissions.js";

describe("InsufficientPermissionsError", () => {
  it("should create an error with default message", () => {
    const error = new InsufficientPermissionsError();

    expect(error).toBeInstanceOf(InsufficientPermissionsError);
    expect(error.message).toBe("Insufficient database permissions");
    expect(error.name).toBe("PostgresInsufficientPermissionsError");
  });

  it("should create an error with custom message", () => {
    const customMessage = "Custom insufficient permissions message";
    const error = new InsufficientPermissionsError(customMessage);

    expect(error.message).toBe(customMessage);
    expect(error.name).toBe("PostgresInsufficientPermissionsError");
  });

  it("should extend ForbiddenError", () => {
    const error = new InsufficientPermissionsError();

    // Check that it has the properties of ForbiddenError
    expect(error).toHaveProperty("status");
    expect(error.status).toBe(403); // Forbidden status code
  });

  it("should be instanceof Error", () => {
    const error = new InsufficientPermissionsError();

    expect(error).toBeInstanceOf(Error);
  });

  it("should have correct stack trace", () => {
    const error = new InsufficientPermissionsError();

    expect(error.stack).toBeDefined();
    expect(typeof error.stack).toBe("string");
    expect(error.stack).toContain("InsufficientPermissionsError");
  });
});
