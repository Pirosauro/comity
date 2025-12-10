import { describe, it, expect } from "vitest";
import { TokenExpiredError } from "../token-expired.js";

describe("TokenExpiredError", () => {
  it("should create error with default message", () => {
    const error = new TokenExpiredError();

    expect(error).toBeInstanceOf(TokenExpiredError);
    expect(error.message).toBe("Token is expired");
    expect(error.name).toBe("TokenExpiredError");
  });

  it("should create error with custom message", () => {
    const customMessage = "Custom expired message";
    const error = new TokenExpiredError(customMessage);

    expect(error).toBeInstanceOf(TokenExpiredError);
    expect(error.message).toBe(customMessage);
    expect(error.name).toBe("TokenExpiredError");
  });

  it("should extend UnauthorizedError", () => {
    const error = new TokenExpiredError();

    // Check that it has UnauthorizedError properties/methods
    expect(error).toHaveProperty("status");
    expect(error.status).toBe(401);
  });
});
