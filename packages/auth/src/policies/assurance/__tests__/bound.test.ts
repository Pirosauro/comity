import type { AuthSession } from "../../../contracts/session.js";

import { describe, expect, it } from "vitest";
import { AuthError } from "../../../errors/auth.js";
import { BoundAssurancePolicy } from "../bound.js";

describe("BoundAssurancePolicy", () => {
  const createMockSession = (context?: Record<string, any>): AuthSession => ({
    id: "session-123",
    createdAt: 1000,
    verifiedAt: 1000,
    assurance: {
      methods: ["password"],
      score: 100,
      evaluatedAt: 1000,
      version: 1,
      ...(context !== undefined ? { context } : {}),
    },
    transport: { type: "bearer" },
  });

  describe("assert", () => {
    it("should pass when session context matches all bounds", () => {
      const policy = new BoundAssurancePolicy({
        ipAddress: "192.168.1.1",
        userAgent: "Mozilla/5.0",
      });
      const session = createMockSession({
        ipAddress: "192.168.1.1",
        userAgent: "Mozilla/5.0",
      });

      expect(() => policy.assert(session)).not.toThrow();
    });

    it("should pass with empty bounds", () => {
      const policy = new BoundAssurancePolicy({});
      const session = createMockSession({ ipAddress: "192.168.1.1" });

      expect(() => policy.assert(session)).not.toThrow();
    });

    it("should pass when bound value is undefined", () => {
      const policy = new BoundAssurancePolicy({
        ipAddress: "192.168.1.1",
        userAgent: undefined,
      });
      const session = createMockSession({
        ipAddress: "192.168.1.1",
        userAgent: "Mozilla/5.0",
      });

      expect(() => policy.assert(session)).not.toThrow();
    });

    it("should throw when context value does not match bound", () => {
      const policy = new BoundAssurancePolicy({
        ipAddress: "192.168.1.1",
      });
      const session = createMockSession({
        ipAddress: "192.168.1.2",
      });

      expect(() => policy.assert(session)).toThrow(AuthError);
    });

    it("should throw with correct error details", () => {
      const policy = new BoundAssurancePolicy({
        ipAddress: "192.168.1.1",
      });
      const session = createMockSession({
        ipAddress: "192.168.1.2",
      });

      try {
        policy.assert(session);
        expect.fail("Should have thrown AuthError");
      } catch (error) {
        expect(error).toBeInstanceOf(AuthError);
        const authError = error as AuthError;
        expect(authError.code).toBe("auth:assurance_invalid");
        expect(authError.meta.details?.policy).toBe("bound");
      }
    });

    it("should handle multiple bounds and fail on first mismatch", () => {
      const policy = new BoundAssurancePolicy({
        ipAddress: "192.168.1.1",
        userAgent: "Mozilla/5.0",
        deviceId: "device1",
      });
      const session = createMockSession({
        ipAddress: "192.168.1.2",
        userAgent: "Mozilla/5.0",
        deviceId: "device1",
      });

      expect(() => policy.assert(session)).toThrow(AuthError);
    });

    it("should pass when all multiple bounds match", () => {
      const policy = new BoundAssurancePolicy({
        ipAddress: "192.168.1.1",
        userAgent: "Mozilla/5.0",
        deviceId: "device1",
      });
      const session = createMockSession({
        ipAddress: "192.168.1.1",
        userAgent: "Mozilla/5.0",
        deviceId: "device1",
      });

      expect(() => policy.assert(session)).not.toThrow();
    });

    it("should handle session with missing assurance context", () => {
      const policy = new BoundAssurancePolicy({
        ipAddress: "192.168.1.1",
      });
      const session = createMockSession();

      expect(() => policy.assert(session)).toThrow(AuthError);
    });

    it("should work with string values", () => {
      const policy = new BoundAssurancePolicy({
        location: "US",
      });
      const session = createMockSession({
        location: "US",
      });

      expect(() => policy.assert(session)).not.toThrow();
    });

    it("should be case-sensitive for string matching", () => {
      const policy = new BoundAssurancePolicy({
        location: "US",
      });
      const session = createMockSession({
        location: "us",
      });

      expect(() => policy.assert(session)).toThrow(AuthError);
    });

    it("should handle empty string as a valid bound value", () => {
      const policy = new BoundAssurancePolicy({
        location: "",
      });
      const session = createMockSession({
        location: "",
      });

      expect(() => policy.assert(session)).not.toThrow();
    });

    it("should fail when context has a property missing that is in bounds", () => {
      const policy = new BoundAssurancePolicy({
        ipAddress: "192.168.1.1",
        deviceId: "device1",
      });
      const session = createMockSession({
        ipAddress: "192.168.1.1",
        // deviceId is missing
      });

      expect(() => policy.assert(session)).toThrow(AuthError);
    });
  });

  describe("constructor", () => {
    it("should accept empty bounds object", () => {
      const policy = new BoundAssurancePolicy({});

      expect(policy).toBeInstanceOf(BoundAssurancePolicy);
    });

    it("should accept bounds with multiple properties", () => {
      const policy = new BoundAssurancePolicy({
        ipAddress: "192.168.1.1",
        userAgent: "Mozilla/5.0",
        deviceId: "device1",
        location: "US",
      });

      expect(policy).toBeInstanceOf(BoundAssurancePolicy);
    });

    it("should accept bounds with undefined values", () => {
      const policy = new BoundAssurancePolicy({
        ipAddress: undefined,
        userAgent: "Mozilla",
      });

      expect(policy).toBeInstanceOf(BoundAssurancePolicy);
    });
  });
});
