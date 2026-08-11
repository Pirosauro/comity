import type { AuthSession } from "../../../contracts/session.js";

import { describe, expect, it } from "vitest";
import { AuthError } from "../../../errors/auth.js";
import { ExpiredSessionRevocationPolicy } from "../expired-session.js";

describe("ExpiredSessionRevocationPolicy", () => {
  const createSession = (createdAt: number, expiresAt?: number): AuthSession => ({
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
    ...(expiresAt !== undefined ? { expiresAt } : {}),
  });

  describe("assert", () => {
    it("should pass when session age is within limit", () => {
      const policy = new ExpiredSessionRevocationPolicy(2000);
      const session = createSession(1000);

      expect(() => policy.assert(session, 2500)).not.toThrow();
    });

    it("should pass just before max age boundary", () => {
      const policy = new ExpiredSessionRevocationPolicy(1000);
      const session = createSession(1000);

      // At 1999, still under max age (1999 < 2000)
      expect(() => policy.assert(session, 1999)).not.toThrow();
    });

    it("should throw when session is exactly at max age", () => {
      const policy = new ExpiredSessionRevocationPolicy(1000);
      const session = createSession(1000);

      // At 2000, fails because now >= expiration (2000 >= 2000)
      expect(() => policy.assert(session, 2000)).toThrow(AuthError);
    });

    it("should throw when session exceeds max age", () => {
      const policy = new ExpiredSessionRevocationPolicy(1000);
      const session = createSession(1000);

      expect(() => policy.assert(session, 2001)).toThrow(AuthError);
    });

    it("should throw with correct error code", () => {
      const policy = new ExpiredSessionRevocationPolicy(1000);
      const session = createSession(1000);

      try {
        policy.assert(session, 2001);
        expect.fail("Should have thrown");
      } catch (error) {
        expect(error).toBeInstanceOf(AuthError);
        const authError = error as AuthError;

        expect(authError.code).toBe("auth:session_expired");
        expect(authError.meta.details?.policy).toBe("expired_session");
      }
    });

    it("should pass when session has explicit expiresAt in future", () => {
      const policy = new ExpiredSessionRevocationPolicy(5000);
      const session = createSession(1000, 6000);

      expect(() => policy.assert(session, 5000)).not.toThrow();
    });

    it("should use earlier of explicit expiresAt and calculated age", () => {
      // max age = 10000, so expiry would be 1000 + 10000 = 11000
      // explicit expiresAt = 5000 (earlier)
      // at time 4999 should pass, at time 5000 should fail
      const policy = new ExpiredSessionRevocationPolicy(10000);
      const session = createSession(1000, 5000);

      expect(() => policy.assert(session, 4999)).not.toThrow();
      expect(() => policy.assert(session, 5000)).toThrow(AuthError);
    });

    it("should use calculated age when explicit expiresAt is later", () => {
      // max age = 1000, so expiry would be 1000 + 1000 = 2000
      // explicit expiresAt = 5000 (later)
      // at time 1999 should pass, at time 2000 should fail
      const policy = new ExpiredSessionRevocationPolicy(1000);
      const session = createSession(1000, 5000);

      expect(() => policy.assert(session, 1999)).not.toThrow();
      expect(() => policy.assert(session, 2000)).toThrow(AuthError);
    });

    it("should handle zero max age", () => {
      const policy = new ExpiredSessionRevocationPolicy(0);
      const session = createSession(1000);

      // expiration = createdAt + 0 = 1000
      // at time 999 should pass, at time 1000 should fail (now >= expiration)
      expect(() => policy.assert(session, 999)).not.toThrow();
      expect(() => policy.assert(session, 1000)).toThrow(AuthError);
    });

    it("should handle large max age", () => {
      const policy = new ExpiredSessionRevocationPolicy(Number.MAX_SAFE_INTEGER);
      const session = createSession(1000);

      expect(() => policy.assert(session, 1000000000)).not.toThrow();
    });
  });

  describe("constructor", () => {
    it("should accept age in milliseconds", () => {
      const policy = new ExpiredSessionRevocationPolicy(5000);

      expect(policy).toBeInstanceOf(ExpiredSessionRevocationPolicy);
    });

    it("should accept zero age", () => {
      const policy = new ExpiredSessionRevocationPolicy(0);

      expect(policy).toBeInstanceOf(ExpiredSessionRevocationPolicy);
    });
  });
});
