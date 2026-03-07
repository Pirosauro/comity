import type { AuthSession } from "../../../contracts/session.js";

import { describe, expect, it } from "vitest";
import { AuthError } from "../../../error/auth.js";
import { ScoreAssurancePolicy } from "../score.js";

describe("ScoreAssurancePolicy", () => {
  const createSession = (score: number): AuthSession => ({
    id: "session-123",
    createdAt: 1000,
    verifiedAt: 1000,
    assurance: {
      methods: ["password"],
      score,
      evaluatedAt: 1000,
      version: 1,
    },
    transport: { type: "bearer" },
  });

  describe("assert", () => {
    it("should pass when score meets minimum requirement", () => {
      const policy = new ScoreAssurancePolicy(50);
      const session = createSession(100);

      expect(() => policy.assert(session)).not.toThrow();
    });

    it("should pass when score equals minimum requirement", () => {
      const policy = new ScoreAssurancePolicy(50);
      const session = createSession(50);

      expect(() => policy.assert(session)).not.toThrow();
    });

    it("should throw when score is below minimum", () => {
      const policy = new ScoreAssurancePolicy(50);
      const session = createSession(49);

      expect(() => policy.assert(session)).toThrow(AuthError);
    });

    it("should throw with correct error code", () => {
      const policy = new ScoreAssurancePolicy(50);
      const session = createSession(40);

      try {
        policy.assert(session);
        expect.fail("Should have thrown AuthError");
      } catch (error) {
        expect(error).toBeInstanceOf(AuthError);
        const authError = error as AuthError;
        expect(authError.code).toBe("auth:assurance_too_low");
      }
    });

    it("should include policy name in metadata", () => {
      const policy = new ScoreAssurancePolicy(50);
      const session = createSession(30);

      try {
        policy.assert(session);
        expect.fail("Should have thrown");
      } catch (error) {
        const authError = error as AuthError;
        expect(authError.meta.details?.policy).toBe("score");
      }
    });

    it("should pass with zero score requirement", () => {
      const policy = new ScoreAssurancePolicy(0);
      const session = createSession(0);

      expect(() => policy.assert(session)).not.toThrow();
    });

    it("should pass with very high score", () => {
      const policy = new ScoreAssurancePolicy(50);
      const session = createSession(Number.MAX_SAFE_INTEGER);

      expect(() => policy.assert(session)).not.toThrow();
    });

    it("should handle negative minimum requirement", () => {
      const policy = new ScoreAssurancePolicy(-10);
      const session = createSession(0);

      expect(() => policy.assert(session)).not.toThrow();
    });

    it("should throw when score is negative but above minimum", () => {
      const policy = new ScoreAssurancePolicy(-5);
      const session = createSession(-10);

      expect(() => policy.assert(session)).toThrow(AuthError);
    });

    it("should handle decimal scores", () => {
      const policy = new ScoreAssurancePolicy(50.5);
      const session = createSession(50.6);

      expect(() => policy.assert(session)).not.toThrow();
    });

    it("should fail for decimal scores below requirement", () => {
      const policy = new ScoreAssurancePolicy(50.5);
      const session = createSession(50.4);

      expect(() => policy.assert(session)).toThrow(AuthError);
    });
  });

  describe("constructor", () => {
    it("should accept score requirement", () => {
      const policy = new ScoreAssurancePolicy(75);
      expect(policy).toBeInstanceOf(ScoreAssurancePolicy);
    });

    it("should accept zero score", () => {
      const policy = new ScoreAssurancePolicy(0);
      expect(policy).toBeInstanceOf(ScoreAssurancePolicy);
    });

    it("should accept negative scores", () => {
      const policy = new ScoreAssurancePolicy(-50);
      expect(policy).toBeInstanceOf(ScoreAssurancePolicy);
    });

    it("should accept high score values", () => {
      const policy = new ScoreAssurancePolicy(1000);
      expect(policy).toBeInstanceOf(ScoreAssurancePolicy);
    });
  });

  describe("edge cases", () => {
    it("should handle boundary conditions correctly", () => {
      const threshold = 75;
      const policy = new ScoreAssurancePolicy(threshold);

      // At boundary
      expect(() => policy.assert(createSession(threshold))).not.toThrow();

      // Just below
      expect(() => policy.assert(createSession(threshold - 0.1))).toThrow(AuthError);

      // Just above
      expect(() => policy.assert(createSession(threshold + 0.1))).not.toThrow();
    });

    it("should handle large score requirements", () => {
      const policy = new ScoreAssurancePolicy(Number.MAX_SAFE_INTEGER - 1);
      const session = createSession(Number.MAX_SAFE_INTEGER);

      expect(() => policy.assert(session)).not.toThrow();
    });
  });
});
