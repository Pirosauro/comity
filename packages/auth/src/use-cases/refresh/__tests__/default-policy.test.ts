import type { AuthSession } from "../../../contracts/session.js";

import { describe, expect, it } from "vitest";
import { SessionRefreshExpiredError } from "../../../errors/session-refresh-expired.js";
import { SessionRefreshNotAllowedError } from "../../../errors/session-refresh-not-allowed.js";
import { DefaultRefreshPolicy } from "../default-policy.js";

describe("DefaultRefreshPolicy", () => {
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
    verifiedAt: 1000,
  };

  it("should pass when refresh is enabled and not expired", () => {
    const session = { ...baseSession, refresh: { enabled: true, expiresAt: 5000 } };
    const policy = new DefaultRefreshPolicy();

    expect(() => policy.assert(session, 2000)).not.toThrow();
  });

  it("should pass when refresh is enabled without expiration", () => {
    const session = { ...baseSession, refresh: { enabled: true } };
    const policy = new DefaultRefreshPolicy();

    expect(() => policy.assert(session, 2000)).not.toThrow();
  });

  it("should throw when refresh is not enabled", () => {
    const session = { ...baseSession, refresh: { enabled: false } };
    const policy = new DefaultRefreshPolicy();

    expect(() => policy.assert(session, 2000)).toThrow(SessionRefreshNotAllowedError);

    try {
      policy.assert(session, 2000);
    } catch (error) {
      expect(error).toBeInstanceOf(SessionRefreshNotAllowedError);

      if (error instanceof SessionRefreshNotAllowedError) {
        expect(error.meta["reason"]).toBe("session_refresh_disabled");
      }
    }
  });

  it("should throw when refresh is missing", () => {
    const policy = new DefaultRefreshPolicy();

    expect(() => policy.assert(baseSession, 2000)).toThrow(SessionRefreshNotAllowedError);
  });

  it("should throw when refresh is null", () => {
    const session = { ...baseSession, refresh: null as any };
    const policy = new DefaultRefreshPolicy();

    expect(() => policy.assert(session, 2000)).toThrow(SessionRefreshNotAllowedError);
  });

  it("should throw when refresh has expired", () => {
    const session = { ...baseSession, refresh: { enabled: true, expiresAt: 1500 } };
    const policy = new DefaultRefreshPolicy();

    expect(() => policy.assert(session, 2000)).toThrow(SessionRefreshExpiredError);
  });

  it("should throw when refresh expires exactly at now", () => {
    const session = { ...baseSession, refresh: { enabled: true, expiresAt: 2000 } };
    const policy = new DefaultRefreshPolicy();

    expect(() => policy.assert(session, 2000)).toThrow(SessionRefreshExpiredError);
  });

  it("should pass when refresh expires after now", () => {
    const session = { ...baseSession, refresh: { enabled: true, expiresAt: 2001 } };
    const policy = new DefaultRefreshPolicy();

    expect(() => policy.assert(session, 2000)).not.toThrow();
  });

  it("should throw when enabled is not explicitly true", () => {
    const session = { ...baseSession, refresh: { enabled: 1 as any } };
    const policy = new DefaultRefreshPolicy();

    expect(() => policy.assert(session, 2000)).toThrow(SessionRefreshNotAllowedError);
  });
});
