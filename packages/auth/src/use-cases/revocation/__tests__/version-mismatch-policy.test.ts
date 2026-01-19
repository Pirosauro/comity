import type { AuthSession } from "../../../contracts/session.js";

import { describe, expect, it } from "vitest";
import { SessionRevokedError } from "../../../errors/session-revoked.js";
import { VersionMismatchRevocationPolicy } from "../version-mismatch-policy.js";

describe("VersionMismatchRevocationPolicy", () => {
  const baseSession: AuthSession = {
    id: "session1",
    createdAt: 1000,
    assurance: {
      methods: ["password"],
      score: 1,
      evaluatedAt: 1000,
      version: 5,
    },
    transport: "web",
  };

  it("should pass when version matches", () => {
    const policy = new VersionMismatchRevocationPolicy(5);

    expect(() => policy.assert(baseSession, 2000)).not.toThrow();
  });

  it("should pass when session version is newer", () => {
    const policy = new VersionMismatchRevocationPolicy(3);

    expect(() => policy.assert(baseSession, 2000)).not.toThrow();
  });

  it("should throw when session version is older", () => {
    const policy = new VersionMismatchRevocationPolicy(10);

    expect(() => policy.assert(baseSession, 2000)).toThrow(SessionRevokedError);
    try {
      policy.assert(baseSession, 2000);
    } catch (error) {
      expect(error).toBeInstanceOf(SessionRevokedError);

      if (error instanceof SessionRevokedError) {
        expect(error.meta["reason"]).toBe("version_mismatch");
        expect(error.meta["expectedVersion"]).toBe(10);
        expect(error.meta["actualVersion"]).toBe(5);
      }
    }
  });

  it("should throw when version is just one behind", () => {
    const policy = new VersionMismatchRevocationPolicy(6);

    expect(() => policy.assert(baseSession, 2000)).toThrow(SessionRevokedError);
  });

  it("should work with zero version", () => {
    const session = { ...baseSession, assurance: { ...baseSession.assurance, version: 0 } };
    const policy = new VersionMismatchRevocationPolicy(0);

    expect(() => policy.assert(session, 2000)).not.toThrow();
  });

  it("should throw when session has zero version but policy expects higher", () => {
    const session = { ...baseSession, assurance: { ...baseSession.assurance, version: 0 } };
    const policy = new VersionMismatchRevocationPolicy(1);

    expect(() => policy.assert(session, 2000)).toThrow(SessionRevokedError);
  });

  it("should throw when version is not a number", () => {
    const session = {
      ...baseSession,
      assurance: { ...baseSession.assurance, version: "5" as any },
    };
    const policy = new VersionMismatchRevocationPolicy(5);

    expect(() => policy.assert(session, 2000)).toThrow(SessionRevokedError);
  });

  it("should throw when version is null", () => {
    const session = {
      ...baseSession,
      assurance: { ...baseSession.assurance, version: null as any },
    };
    const policy = new VersionMismatchRevocationPolicy(5);

    expect(() => policy.assert(session, 2000)).toThrow(SessionRevokedError);
  });

  it("should throw when version is undefined", () => {
    const session = {
      ...baseSession,
      assurance: { ...baseSession.assurance, version: undefined as any },
    };
    const policy = new VersionMismatchRevocationPolicy(5);

    expect(() => policy.assert(session, 2000)).toThrow(SessionRevokedError);
  });
});
