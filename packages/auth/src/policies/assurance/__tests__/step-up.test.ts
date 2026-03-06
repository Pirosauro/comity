import type { AuthSession } from "../../../contracts/session.js";

import { describe, expect, it } from "vitest";
import { AuthError } from "../../../error/auth.js";
import { StepUpRequiredPolicy } from "../step-up.js";

describe("StepUpRequiredPolicy", () => {
  const createSessionWithoutStepUp = (): AuthSession => ({
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

  const createSessionWithStepUp = (): AuthSession => ({
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
    stepUp: {
      parent: "parent-session-456",
      at: 1500,
    },
  });

  describe("assert", () => {
    it("should pass when session has valid stepUp", () => {
      const policy = new StepUpRequiredPolicy();
      const session = createSessionWithStepUp();

      expect(() => policy.assert(session)).not.toThrow();
    });

    it("should throw when session lacks stepUp", () => {
      const policy = new StepUpRequiredPolicy();
      const session = createSessionWithoutStepUp();

      expect(() => policy.assert(session)).toThrow(AuthError);
    });

    it("should throw with correct error code", () => {
      const policy = new StepUpRequiredPolicy();
      const session = createSessionWithoutStepUp();

      try {
        policy.assert(session);
        expect.fail("Should have thrown AuthError");
      } catch (error) {
        expect(error).toBeInstanceOf(AuthError);
        const authError = error as AuthError;
        expect(authError.code).toBe("auth:assurance_step_up_required");
      }
    });

    it("should include policy name in metadata", () => {
      const policy = new StepUpRequiredPolicy();
      const session = createSessionWithoutStepUp();

      try {
        policy.assert(session);
        expect.fail("Should have thrown");
      } catch (error) {
        const authError = error as AuthError;
        expect(authError.meta.policy).toBe("step_up");
      }
    });

    it("should throw when stepUp is null", () => {
      const policy = new StepUpRequiredPolicy();
      const session = { ...createSessionWithoutStepUp(), stepUp: null as any };

      expect(() => policy.assert(session)).toThrow(AuthError);
    });

    it("should throw when stepUp is not an object", () => {
      const policy = new StepUpRequiredPolicy();
      const session = { ...createSessionWithoutStepUp(), stepUp: "not-an-object" as any };

      expect(() => policy.assert(session)).toThrow(AuthError);
    });

    it("should pass with valid stepUp containing parent and at", () => {
      const policy = new StepUpRequiredPolicy();
      const session = createSessionWithStepUp();

      expect(() => policy.assert(session)).not.toThrow();
    });

    it("should pass when stepUp is an object with required fields", () => {
      const policy = new StepUpRequiredPolicy();
      const session = {
        ...createSessionWithoutStepUp(),
        stepUp: { parent: "parent-id", at: 1500 },
      };

      expect(() => policy.assert(session)).not.toThrow();
    });
  });

  describe("constructor", () => {
    it("should create instance", () => {
      const policy = new StepUpRequiredPolicy();
      expect(policy).toBeInstanceOf(StepUpRequiredPolicy);
    });
  });

  describe("interface compliance", () => {
    it("should implement AuthSessionAssurancePolicy", () => {
      const policy = new StepUpRequiredPolicy();
      expect(typeof policy.assert).toBe("function");
    });

    it("should not require timestamp for assertion", () => {
      const policy = new StepUpRequiredPolicy();
      const session = createSessionWithStepUp();

      // @ts-expect-error - assert should not require 'now' parameter
      expect(() => policy.assert(session, 2000)).not.toThrow();
      expect(() => policy.assert(session)).not.toThrow();
    });
  });
});
