import { describe, it, expect } from "vitest";
import { TokenInvalidError } from "../token-invalid.js";

describe("TokenInvalidError", () => {
  it("should create error with default message", () => {
    const error = new TokenInvalidError();

    expect(error).toBeInstanceOf(TokenInvalidError);
    expect(error.message).toBe("Token is invalid or malformed");
    expect(error.name).toBe("TokenInvalidError");
  });

  it("should create error with custom message", () => {
    const customMessage = "Custom invalid message";
    const error = new TokenInvalidError(customMessage);

    expect(error).toBeInstanceOf(TokenInvalidError);
    expect(error.message).toBe(customMessage);
    expect(error.name).toBe("TokenInvalidError");
  });

  it("should extend UnauthorizedError", () => {
    const error = new TokenInvalidError();

    // Check that it has UnauthorizedError properties/methods
    expect(error).toHaveProperty("status");
    expect(error.status).toBe(401);
  });
});
