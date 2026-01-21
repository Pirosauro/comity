import type { AuthSession } from "../../../contracts/session.js";

import { describe, expect, it } from "vitest";
import { AssuranceRequiredError } from "../../../errors/assurance-required.js";
import { ScoreAssurancePolicy } from "../score-policy.js";

describe("ScoreAssurancePolicy", () => {
  const baseSession: AuthSession = {
    id: "session1",
    createdAt: 1000,
    assurance: {
      methods: ["password"],
      score: 5,
      evaluatedAt: 1000,
      version: 1,
    },
    transport: { type: "web" },
  };

  it("should pass when score meets requirement", () => {
    const policy = new ScoreAssurancePolicy(5);

    expect(() => policy.assert(baseSession)).not.toThrow();
  });

  it("should pass when score exceeds requirement", () => {
    const policy = new ScoreAssurancePolicy(3);

    expect(() => policy.assert(baseSession)).not.toThrow();
  });

  it("should pass with zero requirement", () => {
    const policy = new ScoreAssurancePolicy(0);

    expect(() => policy.assert(baseSession)).not.toThrow();
  });

  it("should throw when score is insufficient", () => {
    const policy = new ScoreAssurancePolicy(10);

    expect(() => policy.assert(baseSession)).toThrow(AssuranceRequiredError);
    try {
      policy.assert(baseSession);
    } catch (error) {
      expect(error).toBeInstanceOf(AssuranceRequiredError);

      if (error instanceof AssuranceRequiredError) {
        expect(error.meta["reason"]).toBe("insufficient");
        expect(error.meta["policy"]).toBe("score");
        expect(error.meta["currentScore"]).toBe(5);
        expect(error.meta["requiredScore"]).toBe(10);
      }
    }
  });

  it("should throw when score is just below requirement", () => {
    const policy = new ScoreAssurancePolicy(6);

    expect(() => policy.assert(baseSession)).toThrow(AssuranceRequiredError);
  });

  it("should work with zero score", () => {
    const session = { ...baseSession, assurance: { ...baseSession.assurance, score: 0 } };
    const policy = new ScoreAssurancePolicy(0);

    expect(() => policy.assert(session)).not.toThrow();
  });

  it("should throw when zero score is insufficient", () => {
    const session = { ...baseSession, assurance: { ...baseSession.assurance, score: 0 } };
    const policy = new ScoreAssurancePolicy(1);

    expect(() => policy.assert(session)).toThrow(AssuranceRequiredError);
  });
});
