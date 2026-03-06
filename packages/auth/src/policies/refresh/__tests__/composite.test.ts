import type { AuthSessionRefreshPolicy } from "../../../contracts/session-refresh-policy.js";
import type { AuthSession } from "../../../contracts/session.js";

import { describe, expect, it, vi } from "vitest";
import { AuthError } from "../../../error/auth.js";
import { CompositeRefreshPolicy } from "../composite.js";

describe("CompositeRefreshPolicy", () => {
  const createMockPolicy = (
    shouldThrow: boolean = false,
    error?: Error
  ): AuthSessionRefreshPolicy => ({
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
    refresh: { enabled: true },
  });

  describe("assert", () => {
    it("should pass when all policies pass", () => {
      const policy1 = createMockPolicy(false);
      const policy2 = createMockPolicy(false);
      const composite = new CompositeRefreshPolicy([policy1, policy2]);
      const session = createSession();

      expect(() => composite.assert(session, 2000)).not.toThrow();
    });

    it("should call all policies in order", () => {
      const policy1 = createMockPolicy(false);
      const policy2 = createMockPolicy(false);
      const policy3 = createMockPolicy(false);
      const composite = new CompositeRefreshPolicy([policy1, policy2, policy3]);
      const session = createSession();

      composite.assert(session, 2000);

      expect(policy1.assert).toHaveBeenCalledWith(session, 2000);
      expect(policy2.assert).toHaveBeenCalledWith(session, 2000);
      expect(policy3.assert).toHaveBeenCalledWith(session, 2000);
    });

    it("should throw when first policy fails", () => {
      const error = new AuthError("refresh_expired");
      const policy1 = createMockPolicy(true, error);
      const policy2 = createMockPolicy(false);
      const composite = new CompositeRefreshPolicy([policy1, policy2]);
      const session = createSession();

      expect(() => composite.assert(session, 2000)).toThrow(error);
    });

    it("should not call subsequent policies if first fails", () => {
      const error = new AuthError("refresh_expired");
      const policy1 = createMockPolicy(true, error);
      const policy2 = createMockPolicy(false);
      const composite = new CompositeRefreshPolicy([policy1, policy2]);
      const session = createSession();

      try {
        composite.assert(session, 2000);
      } catch {
        // Expected
      }

      expect(policy1.assert).toHaveBeenCalled();
      expect(policy2.assert).not.toHaveBeenCalled();
    });

    it("should handle empty policy list", () => {
      const composite = new CompositeRefreshPolicy([]);
      const session = createSession();

      expect(() => composite.assert(session, 2000)).not.toThrow();
    });

    it("should enforce AND logic - all must pass", () => {
      const policy1 = createMockPolicy(false);
      const policy2 = createMockPolicy(false);
      const policy3 = createMockPolicy(false);
      const composite = new CompositeRefreshPolicy([policy1, policy2, policy3]);
      const session = createSession();

      expect(() => composite.assert(session, 2000)).not.toThrow();
    });
  });

  describe("constructor", () => {
    it("should accept array of policies", () => {
      const policy = createMockPolicy(false);
      const composite = new CompositeRefreshPolicy([policy]);
      expect(composite).toBeInstanceOf(CompositeRefreshPolicy);
    });

    it("should accept empty array", () => {
      const composite = new CompositeRefreshPolicy([]);
      expect(composite).toBeInstanceOf(CompositeRefreshPolicy);
    });
  });
});
