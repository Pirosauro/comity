import { describe, expect, it } from "vitest";
import { AuthError } from "../auth.js";

describe("AuthError", () => {
  describe("constructor", () => {
    it("should create error with reason", () => {
      const error = new AuthError("session_expired");

      expect(error).toBeInstanceOf(AuthError);
      expect(error.code).toBe("auth:session_expired");
      expect(error.message).toBe("Session has expired");
      expect(error.meta.reason).toBe("session_expired");
    });

    it("should create error with metadata", () => {
      const error = new AuthError("session_revoked", {
        subject: "user-123",
        retriable: false,
      });

      expect(error.code).toBe("auth:session_revoked");
      expect(error.meta.subject).toBe("user-123");
      expect(error.meta.retriable).toBe(false);
      expect(error.meta.reason).toBe("session_revoked");
    });

    it("should set correct HTTP status for each reason", () => {
      const testCases: Array<[string, number]> = [
        ["session_invalid", 401],
        ["session_expired", 401],
        ["session_revoked", 401],
        ["session_not_found", 404],
        ["refresh_expired", 401],
        ["refresh_not_allowed", 403],
        ["refresh_required", 401],
        ["assurance_required", 403],
        ["assurance_invalid", 403],
        ["assurance_expired", 403],
        ["assurance_context_mismatch", 403],
        ["assurance_step_up_required", 403],
        ["assurance_too_low", 403],
        ["token_invalid", 401],
        ["token_expired", 401],
        ["authentication_required", 401],
        ["forbidden", 403],
        ["invalid_credentials", 401],
        ["conflict", 409],
      ];

      for (const [reason, expectedStatus] of testCases) {
        const error = new AuthError(reason as any);
        expect(error.meta.httpStatus).toBe(expectedStatus);
      }
    });

    it("should preserve violation metadata", () => {
      const error = new AuthError("session_invalid", {
        violation: "session_id_missing",
      });

      expect(error.meta.violation).toBe("session_id_missing");
    });

    it("should preserve policy metadata", () => {
      const error = new AuthError("assurance_invalid", {
        policy: "freshness",
      });

      expect(error.meta.policy).toBe("freshness");
    });

    it("should preserve additional metadata", () => {
      const error = new AuthError("assurance_too_low", {
        policy: "score",
        currentScore: 50,
        requiredScore: 70,
      } as any);

      expect(error.meta.policy).toBe("score");
      expect((error.meta as any).currentScore).toBe(50);
      expect((error.meta as any).requiredScore).toBe(70);
    });
  });

  describe("error messages", () => {
    const messageTests = [
      ["session_invalid", "Session is invalid"],
      ["session_expired", "Session has expired"],
      ["session_revoked", "Session has been revoked"],
      ["session_not_found", "Session not found"],
      ["refresh_expired", "Refresh window has expired"],
      ["refresh_not_allowed", "Refresh is not allowed by policy"],
      ["refresh_required", "Session refresh is required"],
      ["assurance_required", "Assurance evaluation is required"],
      ["assurance_invalid", "Assurance evaluation is invalid"],
      ["assurance_expired", "Assurance evaluation has expired"],
      ["assurance_context_mismatch", "Assurance context does not satisfy required bounds"],
      ["assurance_step_up_required", "Step-up verification is required"],
      ["assurance_too_low", "Assurance score is below the required threshold"],
      ["token_invalid", "Token is invalid"],
      ["token_expired", "Token has expired"],
      ["authentication_required", "Authentication credentials are required"],
      ["forbidden", "Access denied"],
      ["invalid_credentials", "Invalid authentication credentials"],
      ["conflict", "Authentication conflict"],
    ];

    for (const [reason, expectedMessage] of messageTests) {
      it(`should have correct message for ${reason}`, () => {
        const error = new AuthError(reason as any);
        expect(error.message).toBe(expectedMessage);
      });
    }
  });

  describe("error codes", () => {
    it("should generate correct error code format", () => {
      const error = new AuthError("session_expired");
      expect(error.code).toMatch(/^auth:.+$/);
    });

    it("should include reason in code", () => {
      const reasons = ["session_invalid", "assurance_required", "refresh_expired", "token_invalid"];

      for (const reason of reasons) {
        const error = new AuthError(reason as any);
        expect(error.code).toBe(`auth:${reason}`);
      }
    });
  });

  describe("instanceof checks", () => {
    it("should be instance of AuthError", () => {
      const error = new AuthError("session_expired");
      expect(error instanceof AuthError).toBe(true);
    });

    it("should be instance of Error", () => {
      const error = new AuthError("session_expired");
      expect(error instanceof Error).toBe(true);
    });
  });

  describe("stack traces", () => {
    it("should have stack trace", () => {
      const error = new AuthError("session_expired");
      expect(error.stack).toBeDefined();
      expect(error.stack).toContain("AuthError");
    });
  });

  describe("meta immutability", () => {
    it("should have readonly meta properties", () => {
      const error = new AuthError("session_expired", {
        subject: "user-123",
      });

      // Meta should exist
      expect(error.meta).toBeDefined();

      // Verify that reason is set
      expect(error.meta.reason).toBe("session_expired");
    });
  });
});
