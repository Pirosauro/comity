import type { AuthSession } from "../../../contracts/session.js";

import { describe, expect, it } from "vitest";
import { AuthError } from "../../../error/auth.js";
import { FreshnessAssurancePolicy } from "../freshness.js";

describe("FreshnessAssurancePolicy", () => {
  const createSession = (evaluatedAt: number): AuthSession => ({
    id: "session-123",
    createdAt: 1000,
    verifiedAt: 1000,
    assurance: {
      methods: ["password"],
      score: 100,
      evaluatedAt,
      version: 1,
    },
    transport: { type: "bearer" },
  });

  describe("assert", () => {
    it("should pass when assurance is within age limit", () => {
      const policy = new FreshnessAssurancePolicy(1000); // 1000ms max age
      const session = createSession(1500); // evaluated 500ms ago
      const now = 2000;

      expect(() => policy.assert(session, now)).not.toThrow();
    });

    it("should pass when assurance is exactly at age limit", () => {
      const policy = new FreshnessAssurancePolicy(1000);
      const session = createSession(1000); // evaluated 1000ms ago
      const now = 2000;

      expect(() => policy.assert(session, now)).not.toThrow();
    });

    it("should throw when assurance exceeds age limit", () => {
      const policy = new FreshnessAssurancePolicy(1000);
      const session = createSession(500); // evaluated 1500ms ago
      const now = 2000;

      expect(() => policy.assert(session, now)).toThrow(AuthError);
    });

    it("should throw with correct error code", () => {
      const policy = new FreshnessAssurancePolicy(1000);
      const session = createSession(500);
      const now = 2000;

      try {
        policy.assert(session, now);
        expect.fail("Should have thrown AuthError");
      } catch (error) {
        expect(error).toBeInstanceOf(AuthError);
        const authError = error as AuthError;
        expect(authError.code).toBe("auth:assurance_expired");
      }
    });

    it("should include policy name in error metadata", () => {
      const policy = new FreshnessAssurancePolicy(1000);
      const session = createSession(500);
      const now = 2000;

      try {
        policy.assert(session, now);
        expect.fail("Should have thrown");
      } catch (error) {
        const authError = error as AuthError;
        expect(authError.meta.policy).toBe("freshness");
      }
    });

    it("should pass with zero age", () => {
      const policy = new FreshnessAssurancePolicy(1000);
      const session = createSession(2000); // evaluated just now
      const now = 2000;

      expect(() => policy.assert(session, now)).not.toThrow();
    });

    it("should handle very large age limits", () => {
      const policy = new FreshnessAssurancePolicy(Number.MAX_SAFE_INTEGER);
      const session = createSession(1000);
      const now = 2000;

      expect(() => policy.assert(session, now)).not.toThrow();
    });

    it("should fail with zero age limit", () => {
      const policy = new FreshnessAssurancePolicy(0);
      const session = createSession(1500); // any age > 0 will fail
      const now = 2000;

      // Only passes if evaluated at exactly now
      expect(() => policy.assert(session, now)).toThrow(AuthError);
    });

    it("should handle small age values", () => {
      const policy = new FreshnessAssurancePolicy(1); // 1ms max age
      const session = createSession(1999); // 1ms old
      const now = 2000;

      expect(() => policy.assert(session, now)).not.toThrow();
    });

    it("should handle small age values exceeding limit", () => {
      const policy = new FreshnessAssurancePolicy(1);
      const session = createSession(1998); // 2ms old
      const now = 2000;

      expect(() => policy.assert(session, now)).toThrow(AuthError);
    });
  });

  describe("constructor", () => {
    it("should accept age in milliseconds", () => {
      const policy = new FreshnessAssurancePolicy(5000);
      expect(policy).toBeInstanceOf(FreshnessAssurancePolicy);
    });

    it("should accept zero age", () => {
      const policy = new FreshnessAssurancePolicy(0);
      expect(policy).toBeInstanceOf(FreshnessAssurancePolicy);
    });

    it("should accept large age values", () => {
      const policy = new FreshnessAssurancePolicy(Number.MAX_SAFE_INTEGER);
      expect(policy).toBeInstanceOf(FreshnessAssurancePolicy);
    });
  });

  describe("edge cases", () => {
    it("should handle boundary conditions correctly", () => {
      const maxAge = 5000;
      const policy = new FreshnessAssurancePolicy(maxAge);
      const now = 10000;

      // At boundary: evaluatedAt + maxAge = now
      const boundarySession = createSession(now - maxAge);
      expect(() => policy.assert(boundarySession, now)).not.toThrow();

      // Just over boundary: evaluatedAt + maxAge < now
      const overSession = createSession(now - maxAge - 1);
      expect(() => policy.assert(overSession, now)).toThrow(AuthError);

      // Just under boundary: evaluatedAt + maxAge > now
      const underSession = createSession(now - maxAge + 1);
      expect(() => policy.assert(underSession, now)).not.toThrow();
    });
  });
});
