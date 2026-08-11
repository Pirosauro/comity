import type { AuthSessionAssurancePolicy } from "../contracts/session-assurance-policy.js";
import type { AuthSessionRefreshPolicy } from "../contracts/session-refresh-policy.js";
import type { AuthSessionRevocationPolicy } from "../contracts/session-revocation-policy.js";
import type { AuthSession } from "../contracts/session.js";
import type { AuthEvaluationObserver } from "../hooks/evaluation.js";
import type { AuthRefreshEvaluationObserver } from "../hooks/refresh.js";

import { beforeEach, describe, expect, it, vi } from "vitest";
import { AuthError } from "../errors/auth.js";
import { AuthGuard } from "../guard.js";
import { AuthSessionId } from "../value-objects/auth-session-id.js";

interface AuthGuardEmitter
  extends AuthEvaluationObserver,
    AuthRefreshEvaluationObserver {}

describe("AuthGuard", () => {
  let assurancePolicy: AuthSessionAssurancePolicy;
  let revocationPolicy: AuthSessionRevocationPolicy;
  let refreshPolicy: AuthSessionRefreshPolicy;
  let events: AuthGuardEmitter;
  let guard: AuthGuard;

  beforeEach(() => {
    assurancePolicy = { assert: vi.fn() };
    revocationPolicy = { assert: vi.fn() };
    refreshPolicy = { assert: vi.fn() };
    events = {
      onSessionValidated: vi.fn(),
      onSessionInvalid: vi.fn(),
      onAssuranceRejected: vi.fn(),
      onRefreshValidated: vi.fn(),
      onRefreshRejected: vi.fn(),
    };
    guard = new AuthGuard({
      assurance: assurancePolicy,
      revocation: revocationPolicy,
      refresh: refreshPolicy,
      observer: events,
    });
  });

  describe("assert", () => {
    const validSession: AuthSession = {
      id: new AuthSessionId("session1"),
      createdAt: 1000,
      assurance: {
        methods: ["password"],
        score: 1,
        evaluatedAt: 1000,
        version: 1,
      },
      transport: { type: "bearer" },
      refresh: { enabled: true },
      verifiedAt: 1000,
    };

    it("should validate a valid session", () => {
      guard.assert(validSession, 2000);

      expect(assurancePolicy.assert).toHaveBeenCalledWith(validSession, 2000);
      expect(revocationPolicy.assert).toHaveBeenCalledWith(validSession, 2000);
      expect(events.onSessionValidated).toHaveBeenCalledWith({
        sessionId: validSession.id,
        assuranceScore: 1,
        createdAt: 1000,
        verifiedAt: 1000,
      });
    });

    it("should throw and emit for invalid session id", () => {
      const invalidSession = { ...validSession, id: new AuthSessionId("") };

      expect(() => guard.assert(invalidSession, 2000)).toThrow(AuthError);
      expect(events.onSessionInvalid).toHaveBeenCalledWith(
        expect.objectContaining({
          sessionId: new AuthSessionId(""),
          at: 2000,
          reason: "session_invalid",
          violation: "session_id_missing",
        })
      );
    });

    it("should throw and emit for revoked session", () => {
      revocationPolicy.assert.mockImplementation(() => {
        throw new AuthError("session_revoked");
      });

      expect(() => guard.assert(validSession, 2000)).toThrow(AuthError);
      expect(events.onSessionInvalid).toHaveBeenCalledWith(
        expect.objectContaining({
          sessionId: validSession.id,
          at: 2000,
          reason: "session_revoked",
        })
      );
    });

    it("should throw and emit for assurance required", () => {
      assurancePolicy.assert.mockImplementation(() => {
        throw new AuthError("assurance_required");
      });

      expect(() => guard.assert(validSession, 2000)).toThrow(AuthError);
      expect(events.onAssuranceRejected).toHaveBeenCalledWith(
        expect.objectContaining({
          sessionId: validSession.id,
          reason: "assurance_required",
        })
      );
    });

    it("should emit sessionValidated with all optional fields", () => {
      const sessionWithOptionals = {
        ...validSession,
        verifiedAt: 1000,
        expiresAt: 5000,
        scopes: ["read", "write"],
      };

      guard.assert(sessionWithOptionals, 2000);

      expect(events.onSessionValidated).toHaveBeenCalledWith({
        sessionId: validSession.id,
        assuranceScore: 1,
        createdAt: 1000,
        verifiedAt: 1000,
        expiresAt: 5000,
        scopes: ["read", "write"],
      });
    });

    it("should emit sessionValidated without optional fields", () => {
      const sessionMinimal: AuthSession = {
        id: new AuthSessionId("session1"),
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

      guard.assert(sessionMinimal, 2000);

      expect(events.onSessionValidated).toHaveBeenCalledWith({
        sessionId: sessionMinimal.id,
        assuranceScore: 1,
        createdAt: 1000,
        verifiedAt: 1000,
      });
    });

    it("should emit refreshValidated when refresh is requested", () => {
      guard.assert(validSession, 2000, true);

      expect(events.onRefreshValidated).toHaveBeenCalledWith({
        sessionId: validSession.id,
        at: 2000,
      });
    });

    it("should emit for revocation error without SessionRevokedError", () => {
      revocationPolicy.assert.mockImplementation(() => {
        throw new Error("Generic error");
      });

      expect(() => guard.assert(validSession, 2000)).toThrow(Error);
      expect(events.onSessionInvalid).toHaveBeenCalled();
    });

    it("should emit for assurance error without AssuranceRequiredError", () => {
      assurancePolicy.assert.mockImplementation(() => {
        throw new Error("Generic error");
      });

      expect(() => guard.assert(validSession, 2000)).toThrow(Error);
      expect(events.onAssuranceRejected).toHaveBeenCalled();
    });
  });

  describe("assertRefreshable", () => {
    const validSession: AuthSession = {
      id: new AuthSessionId("session1"),
      createdAt: 1000,
      assurance: {
        methods: ["password"],
        score: 1,
        evaluatedAt: 1000,
        version: 1,
      },
      transport: { type: "bearer" },
      refresh: { enabled: true },
      verifiedAt: 1000,
    };

    it("should validate refreshable session without refresh policy", () => {
      const guardNoRefresh = new AuthGuard({
        assurance: assurancePolicy,
        revocation: revocationPolicy,
        observer: events,
      });

      guardNoRefresh.assertRefreshable(validSession, 2000);

      expect(events.onRefreshValidated).not.toHaveBeenCalled();
    });

    it("should validate refreshable session with refresh policy", () => {
      guard.assertRefreshable(validSession, 2000);

      expect(refreshPolicy.assert).toHaveBeenCalledWith(validSession, 2000);
      expect(events.onRefreshValidated).not.toHaveBeenCalled();
    });

    it("should throw for refresh expired", () => {
      refreshPolicy.assert.mockImplementation(() => {
        throw new AuthError("refresh_expired");
      });

      expect(() => guard.assertRefreshable(validSession, 2000)).toThrow(AuthError);
      expect(events.onRefreshRejected).toHaveBeenCalledWith(
        expect.objectContaining({
          sessionId: validSession.id,
          reason: "refresh_expired",
        })
      );
    });

    it("should throw for refresh not allowed", () => {
      refreshPolicy.assert.mockImplementation(() => {
        throw new AuthError("refresh_not_allowed");
      });

      expect(() => guard.assertRefreshable(validSession, 2000)).toThrow(AuthError);
      expect(events.onRefreshRejected).toHaveBeenCalledWith(
        expect.objectContaining({
          sessionId: validSession.id,
          reason: "refresh_not_allowed",
        })
      );
    });

    it("should rethrow non-BaseError errors without emitting event", () => {
      refreshPolicy.assert.mockImplementation(() => {
        throw new Error("Generic error");
      });

      expect(() => guard.assertRefreshable(validSession, 2000)).toThrow(Error);
      expect(events.onRefreshRejected).toHaveBeenCalledWith(
        expect.objectContaining({
          sessionId: validSession.id,
          reason: "unknown",
        })
      );
    });

    it("should not call other policies before checking refresh", () => {
      // assertRefreshable only checks refresh policy, not other policies
      guard.assertRefreshable(validSession, 2000);

      expect(refreshPolicy.assert).toHaveBeenCalledWith(validSession, 2000);
      expect(revocationPolicy.assert).not.toHaveBeenCalled();
      expect(assurancePolicy.assert).not.toHaveBeenCalled();
    });
  });
});
