import { describe, it, expect } from "vitest";
import { getFailureReason } from "../failure-reason.js";
import {
  JWTExpired,
  JWTInvalid,
  JWSInvalid,
  JWSSignatureVerificationFailed,
  JWTClaimValidationFailed,
} from "jose/errors";

describe("getFailureReason", () => {
  it("should return 'expired' for JWTExpired errors", () => {
    const error = new Error("Token expired") as any;
    error.constructor = { name: "JWTExpired" };
    Object.setPrototypeOf(error, JWTExpired.prototype);

    const result = getFailureReason(error);
    expect(result).toBe("expired");
  });

  it("should return 'malformed' for JWTInvalid errors", () => {
    const error = new Error("Invalid JWT") as any;
    error.constructor = { name: "JWTInvalid" };
    Object.setPrototypeOf(error, JWTInvalid.prototype);

    const result = getFailureReason(error);
    expect(result).toBe("malformed");
  });

  it("should return 'malformed' for JWSInvalid errors", () => {
    const error = new Error("Invalid JWS") as any;
    error.constructor = { name: "JWSInvalid" };
    Object.setPrototypeOf(error, JWSInvalid.prototype);

    const result = getFailureReason(error);
    expect(result).toBe("malformed");
  });

  it("should return 'invalid-token' for JWSSignatureVerificationFailed errors", () => {
    const error = new Error("Signature verification failed") as any;
    error.constructor = { name: "JWSSignatureVerificationFailed" };
    Object.setPrototypeOf(error, JWSSignatureVerificationFailed.prototype);

    const result = getFailureReason(error);
    expect(result).toBe("invalid-token");
  });

  it("should return 'invalid-token' for JWTClaimValidationFailed errors", () => {
    const error = new Error("Claim validation failed") as any;
    error.constructor = { name: "JWTClaimValidationFailed" };
    Object.setPrototypeOf(error, JWTClaimValidationFailed.prototype);

    const result = getFailureReason(error);
    expect(result).toBe("invalid-token");
  });

  it("should return 'invalid-token' for unknown errors", () => {
    const error = new Error("Unknown error");

    const result = getFailureReason(error);
    expect(result).toBe("invalid-token");
  });

  it("should return 'invalid-token' for generic Error instances", () => {
    const error = new Error("Database connection failed");

    const result = getFailureReason(error);
    expect(result).toBe("invalid-token");
  });

  it("should return 'invalid-token' for TypeError instances", () => {
    const error = new TypeError("Cannot read property of undefined");

    const result = getFailureReason(error);
    expect(result).toBe("invalid-token");
  });

  it("should handle null or undefined errors gracefully", () => {
    const result1 = getFailureReason(null as any);
    const result2 = getFailureReason(undefined as any);

    expect(result1).toBe("invalid-token");
    expect(result2).toBe("invalid-token");
  });

  describe("real JOSE error instances", () => {
    // Note: These tests verify the actual instanceof checks work correctly
    // but we can't easily construct real JOSE errors in tests, so we use
    // the prototype manipulation approach above for more thorough testing

    it("should handle real JOSE errors if instanceof works", () => {
      // Create a mock that behaves like a real JOSE error
      const mockJWTExpired = Object.create(JWTExpired.prototype);
      mockJWTExpired.message = "Token has expired";

      // This tests our fallback to the default case
      const result = getFailureReason(mockJWTExpired);
      expect(result).toBe("expired");
    });
  });
});
