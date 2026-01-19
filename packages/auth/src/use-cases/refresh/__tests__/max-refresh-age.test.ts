import type { AuthSession } from "../../../contracts/session.js";

import { describe, expect, it } from "vitest";
import { SessionRefreshNotAllowedError } from "../../../errors/session-refresh-not-allowed.js";
import { MaxRefreshAgePolicy } from "../max-refresh-age.js";

describe("MaxRefreshAgePolicy", () => {
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

  it("should pass when session age is within limit", () => {
    const policy = new MaxRefreshAgePolicy(2000);

    expect(() => policy.assert(baseSession, 2000)).not.toThrow();
  });

  it("should pass when session age is exactly at limit", () => {
    const policy = new MaxRefreshAgePolicy(1000);

    expect(() => policy.assert(baseSession, 2000)).not.toThrow();
  });

  it("should pass when session is brand new", () => {
    const policy = new MaxRefreshAgePolicy(1000);

    expect(() => policy.assert(baseSession, 1000)).not.toThrow();
  });

  it("should throw when session age exceeds limit", () => {
    const policy = new MaxRefreshAgePolicy(500);

    expect(() => policy.assert(baseSession, 2000)).toThrow(SessionRefreshNotAllowedError);
    try {
      policy.assert(baseSession, 2000);
    } catch (error) {
      expect(error).toBeInstanceOf(SessionRefreshNotAllowedError);

      if (error instanceof SessionRefreshNotAllowedError) {
        expect(error.meta["reason"]).toBe("max_refresh_age_exceeded");
        expect(error.meta["currentAge"]).toBe(1000);
        expect(error.meta["maxAge"]).toBe(500);
      }
    }
  });

  it("should throw when age exceeds by 1ms", () => {
    const policy = new MaxRefreshAgePolicy(999);

    expect(() => policy.assert(baseSession, 2000)).toThrow(SessionRefreshNotAllowedError);
  });

  it("should work with zero age limit", () => {
    const policy = new MaxRefreshAgePolicy(0);

    expect(() => policy.assert(baseSession, 1000)).not.toThrow();
    expect(() => policy.assert(baseSession, 1001)).toThrow(SessionRefreshNotAllowedError);
  });

  it("should work with large age limit", () => {
    const policy = new MaxRefreshAgePolicy(1000000);

    expect(() => policy.assert(baseSession, 500000)).not.toThrow();
  });

  it("should calculate age correctly", () => {
    const policy = new MaxRefreshAgePolicy(5000);
    const session = { ...baseSession, createdAt: 10000 };

    expect(() => policy.assert(session, 15000)).not.toThrow();
    expect(() => policy.assert(session, 15001)).toThrow(SessionRefreshNotAllowedError);
  });
});
