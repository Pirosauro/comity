import type { AuthSession } from "../../../contracts/session.js";

import { describe, expect, it } from "vitest";
import { AuthError } from "../../../errors/auth.js";
import { MaxRefreshAgePolicy } from "../max-age.js";

describe("MaxRefreshAgePolicy", () => {
  const createSession = (createdAt: number): AuthSession => ({
    id: "session-123",
    createdAt,
    verifiedAt: createdAt,
    assurance: {
      methods: ["password"],
      score: 100,
      evaluatedAt: createdAt,
      version: 1,
    },
    transport: { type: "bearer" },
  });

  describe("assert", () => {
    it("should pass when session age is within limit", () => {
      const policy = new MaxRefreshAgePolicy(2000);
      const session = createSession(1000);

      expect(() => policy.assert(session, 2500)).not.toThrow();
    });

    it("should pass when session age is exactly at limit", () => {
      const policy = new MaxRefreshAgePolicy(1000);
      const session = createSession(1000);

      expect(() => policy.assert(session, 2000)).not.toThrow();
    });

    it("should pass when session is brand new", () => {
      const policy = new MaxRefreshAgePolicy(1000);
      const session = createSession(2000);

      expect(() => policy.assert(session, 2000)).not.toThrow();
    });

    it("should throw when session age exceeds limit", () => {
      const policy = new MaxRefreshAgePolicy(500);
      const session = createSession(1000);

      expect(() => policy.assert(session, 2000)).toThrow(AuthError);
    });

    it("should throw with correct error code", () => {
      const policy = new MaxRefreshAgePolicy(500);
      const session = createSession(1000);

      try {
        policy.assert(session, 2000);
        expect.fail("Should have thrown");
      } catch (error) {
        expect(error).toBeInstanceOf(AuthError);
        const authError = error as AuthError;
        expect(authError.code).toBe("auth:refresh_not_allowed");
        expect(authError.meta.details?.policy).toBe("max_refresh_age");
      }
    });

    it("should include metadata in error", () => {
      const policy = new MaxRefreshAgePolicy(500);
      const session = createSession(1000);

      try {
        policy.assert(session, 2000);
        expect.fail("Should have thrown");
      } catch (error) {
        const authError = error as AuthError;

        expect((authError.meta.context as any).currentAge).toBe(1000);
        expect((authError.meta.context as any).maxAge).toBe(500);
      }
    });

    it("should handle boundary case - age equal to limit", () => {
      const policy = new MaxRefreshAgePolicy(1000);
      const session = createSession(1000);

      // age = 2000 - 1000 = 1000, maxAge = 1000
      // Since age > maxAge is false, it should pass
      expect(() => policy.assert(session, 2000)).not.toThrow();
    });

    it("should handle boundary case - age just over limit", () => {
      const policy = new MaxRefreshAgePolicy(1000);
      const session = createSession(1000);

      // age = 2001 - 1000 = 1001, maxAge = 1000
      // age > maxAge is true, so it should throw
      expect(() => policy.assert(session, 2001)).toThrow(AuthError);
    });

    it("should handle zero age limit", () => {
      const policy = new MaxRefreshAgePolicy(0);
      const session = createSession(1000);

      // age = 1001 - 1000 = 1 > 0, should throw
      expect(() => policy.assert(session, 1001)).toThrow(AuthError);
    });

    it("should handle large age limits", () => {
      const policy = new MaxRefreshAgePolicy(Number.MAX_SAFE_INTEGER);
      const session = createSession(1000);

      expect(() => policy.assert(session, 2000)).not.toThrow();
    });
  });

  describe("constructor", () => {
    it("should accept age in milliseconds", () => {
      const policy = new MaxRefreshAgePolicy(5000);
      expect(policy).toBeInstanceOf(MaxRefreshAgePolicy);
    });

    it("should accept zero age", () => {
      const policy = new MaxRefreshAgePolicy(0);
      expect(policy).toBeInstanceOf(MaxRefreshAgePolicy);
    });

    it("should accept large age values", () => {
      const policy = new MaxRefreshAgePolicy(Number.MAX_SAFE_INTEGER);
      expect(policy).toBeInstanceOf(MaxRefreshAgePolicy);
    });
  });
});
