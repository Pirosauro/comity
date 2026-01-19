import type { AuthSession } from "../../../contracts/session.js";

import { describe, expect, it } from "vitest";
import { AssuranceRequiredError } from "../../../errors/assurance-required.js";
import { StepUpRequiredPolicy } from "../step-up-policy.js";

describe("StepUpRequiredPolicy", () => {
  const baseSession: AuthSession = {
    id: "session1",
    createdAt: 1000,
    assurance: {
      methods: ["password"],
      score: 1,
      evaluatedAt: 1000,
      version: 1,
    },
    transport: "web",
  };

  it("should pass when session has valid stepUp", () => {
    const session = { ...baseSession, stepUp: { parent: "parent-session", at: 1500 } };
    const policy = new StepUpRequiredPolicy();

    expect(() => policy.assert(session)).not.toThrow();
  });

  it("should throw when session has no stepUp", () => {
    const policy = new StepUpRequiredPolicy();

    expect(() => policy.assert(baseSession)).toThrow(AssuranceRequiredError);
    try {
      policy.assert(baseSession);
    } catch (error) {
      expect(error).toBeInstanceOf(AssuranceRequiredError);

      if (error instanceof AssuranceRequiredError) {
        expect(error.meta["reason"]).toBe("step_up_required");
        expect(error.meta["policy"]).toBe("step-up");
      }
    }
  });

  it("should throw when stepUp is null", () => {
    const session = { ...baseSession, stepUp: null as any };
    const policy = new StepUpRequiredPolicy();

    expect(() => policy.assert(session)).toThrow(AssuranceRequiredError);
  });

  it("should throw when stepUp is undefined", () => {
    const session = { ...baseSession, stepUp: undefined };
    const policy = new StepUpRequiredPolicy();

    expect(() => policy.assert(session)).toThrow(AssuranceRequiredError);
  });

  it("should throw when stepUp is not an object", () => {
    const session = { ...baseSession, stepUp: "invalid" as any };
    const policy = new StepUpRequiredPolicy();

    expect(() => policy.assert(session)).toThrow(AssuranceRequiredError);
  });

  it("should pass with stepUp even if other fields are missing", () => {
    const session = { ...baseSession, stepUp: {} as any };
    const policy = new StepUpRequiredPolicy();

    expect(() => policy.assert(session)).not.toThrow();
  });
});
