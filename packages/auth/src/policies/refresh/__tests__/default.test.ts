import type { AuthSession } from "../../../contracts/session.js";

import { describe, expect, it } from "vitest";
import { AuthError } from "../../../error/auth.js";
import { DefaultRefreshPolicy } from "../default.js";

describe("DefaultRefreshPolicy", () => {
  const policy = new DefaultRefreshPolicy();

  describe("assert", () => {
    it("should throw when refresh is not enabled", () => {
      const session = {
        refresh: { enabled: false },
      } as AuthSession;

      expect(() => policy.assert(session, Date.now())).toThrow(AuthError);
    });

    it("should throw when refresh is undefined", () => {
      const session = {
        refresh: undefined,
      } as AuthSession;

      expect(() => policy.assert(session, Date.now())).toThrow(AuthError);
    });

    it("should throw when refresh is null", () => {
      // @ts-expect-error
      const session = {
        refresh: null,
      } as AuthSession;

      expect(() => policy.assert(session, Date.now())).toThrow(AuthError);
    });

    it("should throw when refresh token has expired", () => {
      const now = Date.now();
      const session: AuthSession = {
        refresh: { enabled: true, expiresAt: now - 1000 },
      } as AuthSession;

      expect(() => policy.assert(session, now)).toThrow(AuthError);
    });

    it("should throw when refresh token expiration equals current time", () => {
      const now = Date.now();
      const session: AuthSession = {
        refresh: { enabled: true, expiresAt: now },
      } as AuthSession;

      expect(() => policy.assert(session, now)).toThrow(AuthError);
    });

    it("should pass when refresh is enabled and not expired", () => {
      const now = Date.now();
      const session: AuthSession = {
        refresh: { enabled: true, expiresAt: now + 1000 },
      } as AuthSession;

      expect(() => policy.assert(session, now)).not.toThrow();
    });

    it("should pass when refresh is enabled and has no expiration", () => {
      const session: AuthSession = {
        refresh: { enabled: true },
      } as AuthSession;

      expect(() => policy.assert(session, Date.now())).not.toThrow();
    });
  });
});
