import type { AuthSession } from "../../../contracts/session.js";

import { describe, expect, it } from "vitest";
import { CompositeRevocationPolicy } from "../composite-policy.js";
import { ExpiredSessionRevocationPolicy } from "../expired-session-policy.js";
import { VersionMismatchRevocationPolicy } from "../version-mismatch-policy.js";

describe("CompositeRevocationPolicy", () => {
  const baseSession: AuthSession = {
    id: "session1",
    createdAt: 1000,
    assurance: {
      methods: ["password"],
      score: 1,
      evaluatedAt: 1000,
      version: 2,
    },
    transport: { type: "web" },
    expiresAt: 5000,
    verifiedAt: 1000,
  };

  it("should pass when all policies pass", () => {
    const policy = new CompositeRevocationPolicy([
      new ExpiredSessionRevocationPolicy(10000),
      new VersionMismatchRevocationPolicy(2),
    ]);

    expect(() => policy.assert(baseSession, 2000)).not.toThrow();
  });

  it("should pass with empty policies array", () => {
    const policy = new CompositeRevocationPolicy([]);

    expect(() => policy.assert(baseSession, 2000)).not.toThrow();
  });

  it("should pass with single policy", () => {
    const policy = new CompositeRevocationPolicy([new VersionMismatchRevocationPolicy(2)]);

    expect(() => policy.assert(baseSession, 2000)).not.toThrow();
  });

  it("should throw when first policy fails", () => {
    const policy = new CompositeRevocationPolicy([
      new ExpiredSessionRevocationPolicy(500),
      new VersionMismatchRevocationPolicy(2),
    ]);

    expect(() => policy.assert(baseSession, 2000)).toThrow();
  });

  it("should throw when second policy fails", () => {
    const policy = new CompositeRevocationPolicy([
      new ExpiredSessionRevocationPolicy(10000),
      new VersionMismatchRevocationPolicy(5),
    ]);

    expect(() => policy.assert(baseSession, 2000)).toThrow();
  });

  it("should stop on first failure", () => {
    let secondPolicyCalled = false;
    const mockPolicy = {
      assert: () => {
        secondPolicyCalled = true;
      },
    };

    const policy = new CompositeRevocationPolicy([
      new ExpiredSessionRevocationPolicy(500),
      mockPolicy,
    ]);

    expect(() => policy.assert(baseSession, 2000)).toThrow();
    expect(secondPolicyCalled).toBe(false);
  });

  it("should expose policies array", () => {
    const policies = [
      new ExpiredSessionRevocationPolicy(10000),
      new VersionMismatchRevocationPolicy(2),
    ];
    const policy = new CompositeRevocationPolicy(policies);

    expect(policy.policies).toBe(policies);
  });
});
