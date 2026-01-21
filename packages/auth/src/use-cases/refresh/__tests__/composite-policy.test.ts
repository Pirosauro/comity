import type { AuthSession } from "../../../contracts/session.js";

import { describe, expect, it } from "vitest";
import { CompositeRefreshPolicy } from "../composite-policy.js";
import { DefaultRefreshPolicy } from "../default-policy.js";
import { MaxRefreshAgePolicy } from "../max-refresh-age.js";

describe("CompositeRefreshPolicy", () => {
  const baseSession: AuthSession = {
    id: "session1",
    createdAt: 1000,
    assurance: {
      methods: ["password"],
      score: 1,
      evaluatedAt: 1000,
      version: 1,
    },
    transport: { type: "bearer" },
    refresh: {
      enabled: true,
      expiresAt: 5000,
    },
    verifiedAt: 1000,
  };

  it("should pass when all policies pass", () => {
    const policy = new CompositeRefreshPolicy([
      new DefaultRefreshPolicy(),
      new MaxRefreshAgePolicy(5000),
    ]);

    expect(() => policy.assert(baseSession, 2000)).not.toThrow();
  });

  it("should pass with empty policies array", () => {
    const policy = new CompositeRefreshPolicy([]);

    expect(() => policy.assert(baseSession, 2000)).not.toThrow();
  });

  it("should pass with single policy", () => {
    const policy = new CompositeRefreshPolicy([new DefaultRefreshPolicy()]);

    expect(() => policy.assert(baseSession, 2000)).not.toThrow();
  });

  it("should throw when first policy fails", () => {
    const policy = new CompositeRefreshPolicy([
      new MaxRefreshAgePolicy(500),
      new DefaultRefreshPolicy(),
    ]);

    expect(() => policy.assert(baseSession, 2000)).toThrow();
  });

  it("should throw when second policy fails", () => {
    const session = { ...baseSession, refresh: { enabled: false } };
    const policy = new CompositeRefreshPolicy([
      new MaxRefreshAgePolicy(5000),
      new DefaultRefreshPolicy(),
    ]);

    expect(() => policy.assert(session, 2000)).toThrow();
  });

  it("should stop on first failure", () => {
    let secondPolicyCalled = false;
    const mockPolicy = {
      assert: () => {
        secondPolicyCalled = true;
      },
    };

    const policy = new CompositeRefreshPolicy([new MaxRefreshAgePolicy(500), mockPolicy]);

    expect(() => policy.assert(baseSession, 2000)).toThrow();
    expect(secondPolicyCalled).toBe(false);
  });

  it("should pass now parameter to all policies", () => {
    const policy = new CompositeRefreshPolicy([new MaxRefreshAgePolicy(1000)]);

    expect(() => policy.assert(baseSession, 2000)).not.toThrow();
    expect(() => policy.assert(baseSession, 2001)).toThrow();
  });
});
