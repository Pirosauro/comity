import type { AuthSession } from "../../../contracts/session.js";

import { describe, expect, it } from "vitest";
import { AssuranceRequiredError } from "../../../errors/assurance-required.js";
import { FreshnessAssurancePolicy } from "../freshness-policy.js";

describe("FreshnessAssurancePolicy", () => {
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

  it("should pass when assurance is fresh", () => {
    const policy = new FreshnessAssurancePolicy(2000);

    expect(() => policy.assert(baseSession, 2000)).not.toThrow();
  });

  it("should pass when assurance is exactly at the limit", () => {
    const policy = new FreshnessAssurancePolicy(1000);

    expect(() => policy.assert(baseSession, 2000)).not.toThrow();
  });

  it("should pass when assurance is just evaluated", () => {
    const policy = new FreshnessAssurancePolicy(1000);

    expect(() => policy.assert(baseSession, 1000)).not.toThrow();
  });

  it("should throw when assurance is too old", () => {
    const policy = new FreshnessAssurancePolicy(500);

    expect(() => policy.assert(baseSession, 2000)).toThrow(AssuranceRequiredError);
    try {
      policy.assert(baseSession, 2000);
    } catch (error) {
      expect(error).toBeInstanceOf(AssuranceRequiredError);

      if (error instanceof AssuranceRequiredError) {
        expect(error.meta["reason"]).toBe("assurance_expired");
        expect(error.meta["policy"]).toBe("freshness");
        expect(error.meta["currentAge"]).toBe(1000);
        expect(error.meta["maxAge"]).toBe(500);
      }
    }
  });

  it("should throw when assurance age exceeds limit by 1ms", () => {
    const policy = new FreshnessAssurancePolicy(999);

    expect(() => policy.assert(baseSession, 2000)).toThrow(AssuranceRequiredError);
  });

  it("should work with zero age limit", () => {
    const policy = new FreshnessAssurancePolicy(0);

    expect(() => policy.assert(baseSession, 1000)).not.toThrow();
    expect(() => policy.assert(baseSession, 1001)).toThrow(AssuranceRequiredError);
  });

  it("should work with large age limit", () => {
    const policy = new FreshnessAssurancePolicy(1000000);

    expect(() => policy.assert(baseSession, 500000)).not.toThrow();
  });
});
