import type { AuthSessionRevocationPolicy } from "../../../contracts/session-revocation-policy.js";
import type { AuthSession } from "../../../contracts/session.js";

import { describe, expect, it, vi } from "vitest";
import { AuthError } from "../../../errors/auth.js";
import { CompositeRevocationPolicy } from "../composite.js";

describe("CompositeRevocationPolicy", () => {
  const createMockPolicy = (
    shouldThrow: boolean = false,
    error?: Error
  ): AuthSessionRevocationPolicy => ({
    assert: vi.fn(() => {
      if (shouldThrow) {
        throw error || new Error("Policy failed");
      }
    }),
  });

  const createSession = (): AuthSession => ({
    id: "session-123",
    createdAt: 1000,
    verifiedAt: 1000,
    assurance: {
      methods: ["password"],
      score: 100,
      evaluatedAt: 1000,
      version: 1,
    },
    transport: { type: "bearer" },
  });

  describe("assert", () => {
    it("should pass when all policies pass", () => {
      const policy1 = createMockPolicy(false);
      const policy2 = createMockPolicy(false);
      const composite = new CompositeRevocationPolicy([policy1, policy2]);
      const session = createSession();

      expect(() => composite.assert(session, 2000)).not.toThrow();
    });

    it("should call all policies in order", () => {
      const policy1 = createMockPolicy(false);
      const policy2 = createMockPolicy(false);
      const policy3 = createMockPolicy(false);
      const composite = new CompositeRevocationPolicy([policy1, policy2, policy3]);
      const session = createSession();

      composite.assert(session, 2000);

      expect(policy1.assert).toHaveBeenCalledWith(session, 2000);
      expect(policy2.assert).toHaveBeenCalledWith(session, 2000);
      expect(policy3.assert).toHaveBeenCalledWith(session, 2000);
    });

    it("should throw when first policy fails", () => {
      const error = new AuthError("session_revoked");
      const policy1 = createMockPolicy(true, error);
      const policy2 = createMockPolicy(false);
      const composite = new CompositeRevocationPolicy([policy1, policy2]);
      const session = createSession();

      expect(() => composite.assert(session, 2000)).toThrow(error);
    });

    it("should not call subsequent policies if first fails", () => {
      const error = new AuthError("session_revoked");
      const policy1 = createMockPolicy(true, error);
      const policy2 = createMockPolicy(false);
      const composite = new CompositeRevocationPolicy([policy1, policy2]);
      const session = createSession();

      try {
        composite.assert(session, 2000);
      } catch {
        // Expected
      }

      expect(policy1.assert).toHaveBeenCalled();
      expect(policy2.assert).not.toHaveBeenCalled();
    });

    it("should throw when second policy fails", () => {
      const error = new AuthError("session_expired");
      const policy1 = createMockPolicy(false);
      const policy2 = createMockPolicy(true, error);
      const composite = new CompositeRevocationPolicy([policy1, policy2]);
      const session = createSession();

      expect(() => composite.assert(session, 2000)).toThrow(error);
    });

    it("should handle empty policy list", () => {
      const composite = new CompositeRevocationPolicy([]);
      const session = createSession();

      expect(() => composite.assert(session, 2000)).not.toThrow();
    });

    it("should enforce AND logic - all must pass", () => {
      const policy1 = createMockPolicy(false);
      const policy2 = createMockPolicy(false);
      const policy3 = createMockPolicy(false);
      const composite = new CompositeRevocationPolicy([policy1, policy2, policy3]);
      const session = createSession();

      expect(() => composite.assert(session, 2000)).not.toThrow();
    });

    it("should pass timestamp to all policies", () => {
      const policy1 = createMockPolicy(false);
      const policy2 = createMockPolicy(false);
      const composite = new CompositeRevocationPolicy([policy1, policy2]);
      const session = createSession();
      const now = 5000;

      composite.assert(session, now);

      expect(policy1.assert).toHaveBeenCalledWith(session, 5000);
      expect(policy2.assert).toHaveBeenCalledWith(session, 5000);
    });

    it("should rethrow errors from policies", () => {
      const customError = new Error("Custom policy error");
      const policy = createMockPolicy(true, customError);
      const composite = new CompositeRevocationPolicy([policy]);
      const session = createSession();

      expect(() => composite.assert(session, 2000)).toThrow(customError);
    });
  });

  describe("constructor", () => {
    it("should accept array of policies", () => {
      const policy = createMockPolicy(false);
      const composite = new CompositeRevocationPolicy([policy]);
      expect(composite).toBeInstanceOf(CompositeRevocationPolicy);
    });

    it("should accept empty array", () => {
      const composite = new CompositeRevocationPolicy([]);
      expect(composite).toBeInstanceOf(CompositeRevocationPolicy);
    });

    it("should accept multiple policies", () => {
      const policies = [createMockPolicy(false), createMockPolicy(false), createMockPolicy(false)];
      const composite = new CompositeRevocationPolicy(policies);
      expect(composite).toBeInstanceOf(CompositeRevocationPolicy);
    });

    it("should snapshot the provided policy list", () => {
      const policy1 = createMockPolicy(false);
      const policy2 = createMockPolicy(false);
      const policies = [policy1];
      const composite = new CompositeRevocationPolicy(policies);

      policies.push(policy2);
      composite.assert(createSession(), 2000);

      expect(policy1.assert).toHaveBeenCalled();
      expect(policy2.assert).not.toHaveBeenCalled();
    });
  });
});
