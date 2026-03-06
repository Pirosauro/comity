import type { AuthSession } from "../../../contracts/session.js";

import { describe, expect, it } from "vitest";
import { AuthError } from "../../../error/auth.js";
import { VersionMismatchRevocationPolicy } from "../version-mismatch.js";

describe("VersionMismatchRevocationPolicy", () => {
  const createSession = (version: number): AuthSession => ({
    id: "session-123",
    createdAt: 1000,
    verifiedAt: 1000,
    assurance: {
      methods: ["password"],
      score: 100,
      evaluatedAt: 1000,
      version,
    },
    transport: { type: "bearer" },
  });

  describe("assert", () => {
    it("should pass when version meets or exceeds requirement", () => {
      const policy = new VersionMismatchRevocationPolicy(1);
      const session = createSession(1);

      expect(() => policy.assert(session, 2000)).not.toThrow();
    });

    it("should pass when version exceeds requirement", () => {
      const policy = new VersionMismatchRevocationPolicy(1);
      const session = createSession(5);

      expect(() => policy.assert(session, 2000)).not.toThrow();
    });

    it("should throw when version is below requirement", () => {
      const policy = new VersionMismatchRevocationPolicy(2);
      const session = createSession(1);

      expect(() => policy.assert(session, 2000)).toThrow(AuthError);
    });

    it("should throw with correct error code", () => {
      const policy = new VersionMismatchRevocationPolicy(2);
      const session = createSession(1);

      try {
        policy.assert(session, 2000);
        expect.fail("Should have thrown");
      } catch (error) {
        expect(error).toBeInstanceOf(AuthError);
        const authError = error as AuthError;

        expect(authError.code).toBe("auth:session_revoked");
        expect(authError.meta.policy).toBe("version_mismatch");
      }
    });

    it("should include version metadata in error", () => {
      const policy = new VersionMismatchRevocationPolicy(3);
      const session = createSession(1);

      try {
        policy.assert(session, 2000);
        expect.fail("Should have thrown");
      } catch (error) {
        const authError = error as AuthError;

        expect((authError.meta.details as any).expectedVersion).toBe(3);
        expect((authError.meta.details as any).actualVersion).toBe(1);
      }
    });

    it("should handle version 0", () => {
      const policy = new VersionMismatchRevocationPolicy(0);
      const session = createSession(0);

      expect(() => policy.assert(session, 2000)).not.toThrow();
    });

    it("should handle large version numbers", () => {
      const policy = new VersionMismatchRevocationPolicy(1000000);
      const session = createSession(1000000);

      expect(() => policy.assert(session, 2000)).not.toThrow();
    });

    it("should fail when version is non-numeric", () => {
      const policy = new VersionMismatchRevocationPolicy(1);
      const session = {
        ...createSession(1),
        assurance: { ...createSession(1).assurance, version: "1" as any },
      };

      expect(() => policy.assert(session, 2000)).toThrow(AuthError);
    });

    it("should fail with zero requirement and zero version", () => {
      const policy = new VersionMismatchRevocationPolicy(0);
      const session = createSession(0);

      expect(() => policy.assert(session, 2000)).not.toThrow();
    });

    it("should fail at boundary - version equals requirement - 1", () => {
      const policy = new VersionMismatchRevocationPolicy(5);
      const session = createSession(4);

      expect(() => policy.assert(session, 2000)).toThrow(AuthError);
    });

    it("should pass at boundary - version equals requirement", () => {
      const policy = new VersionMismatchRevocationPolicy(5);
      const session = createSession(5);

      expect(() => policy.assert(session, 2000)).not.toThrow();
    });
  });

  describe("constructor", () => {
    it("should accept version number", () => {
      const policy = new VersionMismatchRevocationPolicy(1);

      expect(policy).toBeInstanceOf(VersionMismatchRevocationPolicy);
    });

    it("should accept zero version", () => {
      const policy = new VersionMismatchRevocationPolicy(0);

      expect(policy).toBeInstanceOf(VersionMismatchRevocationPolicy);
    });

    it("should accept large version numbers", () => {
      const policy = new VersionMismatchRevocationPolicy(1000000);

      expect(policy).toBeInstanceOf(VersionMismatchRevocationPolicy);
    });
  });
});
