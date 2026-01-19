import { describe, expect, it } from "vitest";
import { AUTH_TOKEN_INVALID_REASONS, AuthTokenInvalidError } from "../auth-token-invalid.js";

describe("AuthTokenInvalidError", () => {
  it("should create error with default message", () => {
    const error = new AuthTokenInvalidError();

    expect(error.message).toBe("Invalid authentication token");
    expect(error.code).toBe("auth:token_invalid");
    expect(error.meta.httpStatus).toBe(401);
  });

  it("should create error with reason metadata", () => {
    const error = new AuthTokenInvalidError({
      reason: AUTH_TOKEN_INVALID_REASONS.TOKEN_EXPIRED,
    });

    expect(error.meta["reason"]).toBe("token_expired");
  });

  it("should create error with all reasons", () => {
    const error1 = new AuthTokenInvalidError({
      reason: AUTH_TOKEN_INVALID_REASONS.TOKEN_INVALID,
    });

    expect(error1.meta["reason"]).toBe("token_invalid");

    const error2 = new AuthTokenInvalidError({
      reason: AUTH_TOKEN_INVALID_REASONS.TOKEN_EXPIRED,
    });

    expect(error2.meta["reason"]).toBe("token_expired");

    const error3 = new AuthTokenInvalidError({
      reason: AUTH_TOKEN_INVALID_REASONS.TOKEN_NOT_ACTIVE,
    });

    expect(error3.meta["reason"]).toBe("token_not_active");
  });
});
