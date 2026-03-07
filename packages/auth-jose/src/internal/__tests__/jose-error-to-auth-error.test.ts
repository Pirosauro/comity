import { describe, expect, it } from "vitest";
import { joseErrorToAuthError } from "../jose-error-to-auth-error.js";

describe("joseErrorToAuthError", () => {
  it("maps signing failures to invalid_credentials", () => {
    const error = Object.assign(new Error("bad key"), { code: "ERR_JWT_EXPIRED" });
    const result = joseErrorToAuthError(error, "sign", "session-1");

    expect(result.meta.reason).toBe("invalid_credentials");
    expect(result.meta.details).toEqual({ policy: "jwt", subject: "session-1" });
    expect(result.meta.context).toEqual({
      adapter: "jose",
      error: { code: "ERR_JWT_EXPIRED", message: "bad key" },
    });
  });

  it("maps expired verify errors to token_expired", () => {
    const error = Object.assign(new Error("expired"), { code: "ERR_JWT_EXPIRED" });
    const result = joseErrorToAuthError(error, "verify");

    expect(result.meta.reason).toBe("token_expired");
  });

  it("maps unknown verify errors to token_invalid", () => {
    const error = Object.assign(new Error("invalid"), { code: "ERR_JWT_INVALID" });
    const result = joseErrorToAuthError(error, "verify");

    expect(result.meta.reason).toBe("token_invalid");
  });

  it("handles non-error inputs", () => {
    const result = joseErrorToAuthError("oops", "verify");

    expect(result.meta.reason).toBe("token_invalid");
    expect(result.meta.context).toEqual({
      adapter: "jose",
      error: { code: "UNKNOWN", message: "Unknown error" },
    });
  });
});
