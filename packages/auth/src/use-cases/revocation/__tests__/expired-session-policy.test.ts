import type { AuthSession } from "../../../contracts/session.js";

import { describe, expect, it } from "vitest";
import { SessionRevokedError } from "../../../errors/session-revoked.js";
import { ExpiredSessionRevocationPolicy } from "../expired-session-policy.js";

describe("ExpiredSessionRevocationPolicy", () => {
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

  it("should pass when session is not expired (no explicit expiresAt)", () => {
    const policy = new ExpiredSessionRevocationPolicy(5000);

    expect(() => policy.assert(baseSession, 2000)).not.toThrow();
  });

  it("should pass when session has not expired (with explicit expiresAt)", () => {
    const session = { ...baseSession, expiresAt: 5000 };
    const policy = new ExpiredSessionRevocationPolicy(10000);

    expect(() => policy.assert(session, 2000)).not.toThrow();
  });

  it("should pass at boundary (fallback expiry)", () => {
    const policy = new ExpiredSessionRevocationPolicy(1000);

    expect(() => policy.assert(baseSession, 1999)).not.toThrow();
  });

  it("should throw when session expired by fallback age", () => {
    const policy = new ExpiredSessionRevocationPolicy(1000);

    expect(() => policy.assert(baseSession, 2000)).toThrow(SessionRevokedError);
    try {
      policy.assert(baseSession, 2000);
    } catch (error) {
      expect(error).toBeInstanceOf(SessionRevokedError);
      if (error instanceof SessionRevokedError) {
        expect(error.meta["reason"]).toBe("expired");
      }
    }
  });

  it("should throw when session expired by explicit expiresAt", () => {
    const session = { ...baseSession, expiresAt: 1500 };
    const policy = new ExpiredSessionRevocationPolicy(10000);

    expect(() => policy.assert(session, 1500)).toThrow(SessionRevokedError);
  });

  it("should use minimum of explicit and fallback expiry", () => {
    // Explicit expiry: 3000, Fallback expiry: 1000 + 1500 = 2500
    const session = { ...baseSession, expiresAt: 3000 };
    const policy = new ExpiredSessionRevocationPolicy(1500);

    // Should use fallback (2500) as it's earlier
    expect(() => policy.assert(session, 2499)).not.toThrow();
    expect(() => policy.assert(session, 2500)).toThrow(SessionRevokedError);
  });

  it("should use explicit expiry when it is earlier", () => {
    // Explicit expiry: 2000, Fallback expiry: 1000 + 5000 = 6000
    const session = { ...baseSession, expiresAt: 2000 };
    const policy = new ExpiredSessionRevocationPolicy(5000);

    // Should use explicit (2000) as it's earlier
    expect(() => policy.assert(session, 1999)).not.toThrow();
    expect(() => policy.assert(session, 2000)).toThrow(SessionRevokedError);
  });

  it("should work with zero age", () => {
    const policy = new ExpiredSessionRevocationPolicy(0);

    expect(() => policy.assert(baseSession, 999)).not.toThrow();
    expect(() => policy.assert(baseSession, 1000)).toThrow(SessionRevokedError);
  });

  it("should work with large age", () => {
    const policy = new ExpiredSessionRevocationPolicy(1000000);

    expect(() => policy.assert(baseSession, 500000)).not.toThrow();
  });

  it("should handle session created in future edge case", () => {
    const session = { ...baseSession, createdAt: 5000 };
    const policy = new ExpiredSessionRevocationPolicy(1000);

    expect(() => policy.assert(session, 5999)).not.toThrow();
    expect(() => policy.assert(session, 6000)).toThrow(SessionRevokedError);
  });
});
