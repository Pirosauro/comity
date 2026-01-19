import type { AuthSession } from "../../../contracts/session.js";

import { describe, expect, it } from "vitest";
import { CompositeAssurancePolicy } from "../composite-policy.js";
import { FreshnessAssurancePolicy } from "../freshness-policy.js";
import { ScoreAssurancePolicy } from "../score-policy.js";

describe("CompositeAssurancePolicy", () => {
  const baseSession: AuthSession = {
    id: "session1",
    createdAt: 1000,
    assurance: {
      methods: ["password"],
      score: 5,
      evaluatedAt: 1000,
      version: 1,
    },
    transport: "web",
  };

  it("should pass when all policies pass", () => {
    const policy = new CompositeAssurancePolicy([
      new ScoreAssurancePolicy(3),
      new FreshnessAssurancePolicy(2000),
    ]);

    expect(() => policy.assert(baseSession, 2000)).not.toThrow();
  });

  it("should pass with empty policies array", () => {
    const policy = new CompositeAssurancePolicy([]);

    expect(() => policy.assert(baseSession, 2000)).not.toThrow();
  });

  it("should pass with single policy that passes", () => {
    const policy = new CompositeAssurancePolicy([new ScoreAssurancePolicy(3)]);

    expect(() => policy.assert(baseSession, 2000)).not.toThrow();
  });

  it("should throw when first policy fails", () => {
    const policy = new CompositeAssurancePolicy([
      new ScoreAssurancePolicy(10),
      new FreshnessAssurancePolicy(2000),
    ]);

    expect(() => policy.assert(baseSession, 2000)).toThrow();
  });

  it("should throw when second policy fails", () => {
    const policy = new CompositeAssurancePolicy([
      new ScoreAssurancePolicy(3),
      new FreshnessAssurancePolicy(500),
    ]);

    expect(() => policy.assert(baseSession, 2000)).toThrow();
  });

  it("should throw on first failure and not evaluate remaining policies", () => {
    let secondPolicyCalled = false;
    const mockPolicy = {
      assert: () => {
        secondPolicyCalled = true;
      },
    };

    const policy = new CompositeAssurancePolicy([new ScoreAssurancePolicy(10), mockPolicy]);

    expect(() => policy.assert(baseSession, 2000)).toThrow();
    expect(secondPolicyCalled).toBe(false);
  });

  it("should pass now parameter to all policies", () => {
    const policy = new CompositeAssurancePolicy([new FreshnessAssurancePolicy(1500)]);

    expect(() => policy.assert(baseSession, 2500)).not.toThrow();
    expect(() => policy.assert(baseSession, 2501)).toThrow();
  });
});
