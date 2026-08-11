import type { AuthSessionAssurancePolicy } from "../../../contracts/session-assurance-policy.js";
import type { AuthSession } from "../../../contracts/session.js";

import { describe, expect, it, vi } from "vitest";
import { AuthError } from "../../../errors/auth.js";
import { CompositeAssurancePolicy } from "../composite.js";

describe("CompositeAssurancePolicy", () => {
  const createMockPolicy = (
    shouldThrow: boolean = false,
    error?: Error
  ): AuthSessionAssurancePolicy => ({
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
      const policy3 = createMockPolicy(false);
      const composite = new CompositeAssurancePolicy([policy1, policy2, policy3]);
      const session = createSession();

      expect(() => composite.assert(session, 2000)).not.toThrow();
    });

    it("should call all policies in order", () => {
      const policy1 = createMockPolicy(false);
      const policy2 = createMockPolicy(false);
      const policy3 = createMockPolicy(false);
      const composite = new CompositeAssurancePolicy([policy1, policy2, policy3]);
      const session = createSession();

      composite.assert(session, 2000);

      expect(policy1.assert).toHaveBeenCalledWith(session, 2000);
      expect(policy2.assert).toHaveBeenCalledWith(session, 2000);
      expect(policy3.assert).toHaveBeenCalledWith(session, 2000);
    });

    it("should throw when first policy fails", () => {
      const error = new AuthError("assurance_invalid");
      const policy1 = createMockPolicy(true, error);
      const policy2 = createMockPolicy(false);
      const composite = new CompositeAssurancePolicy([policy1, policy2]);
      const session = createSession();

      expect(() => composite.assert(session, 2000)).toThrow(error);
    });

    it("should not call subsequent policies if first fails", () => {
      const error = new AuthError("assurance_invalid");
      const policy1 = createMockPolicy(true, error);
      const policy2 = createMockPolicy(false);
      const composite = new CompositeAssurancePolicy([policy1, policy2]);
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
      const error = new AuthError("assurance_expired");
      const policy1 = createMockPolicy(false);
      const policy2 = createMockPolicy(true, error);
      const policy3 = createMockPolicy(false);
      const composite = new CompositeAssurancePolicy([policy1, policy2, policy3]);
      const session = createSession();

      expect(() => composite.assert(session, 2000)).toThrow(error);
    });

    it("should not call third policy if second fails", () => {
      const error = new AuthError("assurance_expired");
      const policy1 = createMockPolicy(false);
      const policy2 = createMockPolicy(true, error);
      const policy3 = createMockPolicy(false);
      const composite = new CompositeAssurancePolicy([policy1, policy2, policy3]);
      const session = createSession();

      try {
        composite.assert(session, 2000);
      } catch {
        // Expected
      }

      expect(policy1.assert).toHaveBeenCalled();
      expect(policy2.assert).toHaveBeenCalled();
      expect(policy3.assert).not.toHaveBeenCalled();
    });

    it("should handle empty policy list", () => {
      const composite = new CompositeAssurancePolicy([]);
      const session = createSession();

      expect(() => composite.assert(session, 2000)).not.toThrow();
    });

    it("should handle single policy", () => {
      const policy = createMockPolicy(false);
      const composite = new CompositeAssurancePolicy([policy]);
      const session = createSession();

      expect(() => composite.assert(session, 2000)).not.toThrow();
      expect(policy.assert).toHaveBeenCalledWith(session, 2000);
    });

    it("should pass timestamp to all policies", () => {
      const policy1 = createMockPolicy(false);
      const policy2 = createMockPolicy(false);
      const composite = new CompositeAssurancePolicy([policy1, policy2]);
      const session = createSession();
      const now = 5000;

      composite.assert(session, now);

      expect(policy1.assert).toHaveBeenCalledWith(session, 5000);
      expect(policy2.assert).toHaveBeenCalledWith(session, 5000);
    });

    it("should rethrow errors from policies", () => {
      const customError = new Error("Custom policy error");
      const policy = createMockPolicy(true, customError);
      const composite = new CompositeAssurancePolicy([policy]);
      const session = createSession();

      expect(() => composite.assert(session, 2000)).toThrow(customError);
    });

    it("should handle AuthError from policies", () => {
      const authError = new AuthError("assurance_too_low", { policy: "score" });
      const policy = createMockPolicy(true, authError);
      const composite = new CompositeAssurancePolicy([policy]);
      const session = createSession();

      expect(() => composite.assert(session, 2000)).toThrow(authError);
    });
  });

  describe("constructor", () => {
    it("should accept array of policies", () => {
      const policy1 = createMockPolicy(false);
      const policy2 = createMockPolicy(false);
      const composite = new CompositeAssurancePolicy([policy1, policy2]);

      expect(composite).toBeInstanceOf(CompositeAssurancePolicy);
    });

    it("should accept empty array", () => {
      const composite = new CompositeAssurancePolicy([]);
      expect(composite).toBeInstanceOf(CompositeAssurancePolicy);
    });

    it("should accept single policy", () => {
      const policy = createMockPolicy(false);
      const composite = new CompositeAssurancePolicy([policy]);
      expect(composite).toBeInstanceOf(CompositeAssurancePolicy);
    });

    it("should accept multiple policies", () => {
      const policies = [
        createMockPolicy(false),
        createMockPolicy(false),
        createMockPolicy(false),
        createMockPolicy(false),
        createMockPolicy(false),
      ];
      const composite = new CompositeAssurancePolicy(policies);
      expect(composite).toBeInstanceOf(CompositeAssurancePolicy);
    });
  });

  describe("interface compliance", () => {
    it("should implement AuthSessionAssurancePolicy", () => {
      const composite = new CompositeAssurancePolicy([]);
      expect(typeof composite.assert).toBe("function");
    });

    it("should call assert with correct parameters", () => {
      const policy = createMockPolicy(false);
      const composite = new CompositeAssurancePolicy([policy]);
      const session = createSession();
      const now = 3000;

      composite.assert(session, now);

      expect(policy.assert).toHaveBeenCalledWith(session, now);
      expect(policy.assert).toHaveBeenCalledTimes(1);
    });
  });

  describe("composite behavior", () => {
    it("should enforce AND logic - all must pass", () => {
      const policy1 = createMockPolicy(false);
      const policy2 = createMockPolicy(false);
      const policy3 = createMockPolicy(false);
      const composite = new CompositeAssurancePolicy([policy1, policy2, policy3]);
      const session = createSession();

      expect(() => composite.assert(session, 2000)).not.toThrow();
    });

    it("should enforce AND logic - fail if any fails", () => {
      const policy1 = createMockPolicy(false);
      const policy2 = createMockPolicy(true, new AuthError("assurance_invalid"));
      const policy3 = createMockPolicy(false);
      const composite = new CompositeAssurancePolicy([policy1, policy2, policy3]);
      const session = createSession();

      expect(() => composite.assert(session, 2000)).toThrow();
    });

    it("should evaluate policies in sequence (short-circuit)", () => {
      const policy1 = createMockPolicy(false);
      const policy2 = createMockPolicy(true, new AuthError("assurance_invalid"));
      const policy3 = createMockPolicy(false);
      const composite = new CompositeAssurancePolicy([policy1, policy2, policy3]);
      const session = createSession();

      try {
        composite.assert(session, 2000);
      } catch {
        // Expected
      }

      // Policy 3 should not be called because policy 2 failed
      expect(policy3.assert).not.toHaveBeenCalled();
    });
  });
});
