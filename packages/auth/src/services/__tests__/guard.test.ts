import { BaseError } from "@comity/core/errors";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AssuranceRequiredError } from "../../errors/assurance-required.js";
import { InvalidSessionError } from "../../errors/invalid-session.js";
import { SessionRefreshExpiredError } from "../../errors/session-refresh-expired.js";
import { SessionRefreshNotAllowedError } from "../../errors/session-refresh-not-allowed.js";
import { SessionRevokedError } from "../../errors/session-revoked.js";
import { AuthGuard } from "../guard.js";

describe("AuthGuard", () => {
  let assurancePolicy: { assert: ReturnType<typeof vi.fn> };
  let revocationPolicy: { assert: ReturnType<typeof vi.fn> };
  let refreshPolicy: { assert: ReturnType<typeof vi.fn> };
  let events: {
    sessionValidated: ReturnType<typeof vi.fn>;
    sessionInvalid: ReturnType<typeof vi.fn>;
    sessionRejected: ReturnType<typeof vi.fn>;
    refreshValidated: ReturnType<typeof vi.fn>;
    refreshRejected: ReturnType<typeof vi.fn>;
  };
  let guard: AuthGuard;

  beforeEach(() => {
    assurancePolicy = { assert: vi.fn() };
    revocationPolicy = { assert: vi.fn() };
    refreshPolicy = { assert: vi.fn() };
    events = {
      sessionValidated: vi.fn(),
      sessionInvalid: vi.fn(),
      sessionRejected: vi.fn(),
      refreshValidated: vi.fn(),
      refreshRejected: vi.fn(),
    };
    guard = new AuthGuard(
      // @ts-expect-error
      { assurance: assurancePolicy, revocation: revocationPolicy, refresh: refreshPolicy },
      events
    );
  });

  describe("assert", () => {
    const validSession = {
      id: "session1",
      createdAt: 1000,
      assurance: {
        methods: ["password"],
        score: 1,
        evaluatedAt: 1000,
        version: 1,
      },
      transport: "web",
      refresh: { enabled: true },
    };

    it("should validate a valid session", () => {
      guard.assert(validSession, 2000);

      expect(assurancePolicy.assert).toHaveBeenCalledWith(validSession, 2000);
      expect(revocationPolicy.assert).toHaveBeenCalledWith(validSession, 2000);
      expect(events.sessionValidated).toHaveBeenCalledWith({
        sessionId: "session1",
        assuranceScore: 1,
        createdAt: 1000,
      });
    });

    it("should throw and emit for invalid session id", () => {
      const invalidSession = { ...validSession, id: "" };

      expect(() => guard.assert(invalidSession, 2000)).toThrow(InvalidSessionError);
      expect(events.sessionInvalid).toHaveBeenCalledWith({
        sessionId: "",
        at: 2000,
        reason: "session_id_missing",
      });
    });

    it("should throw and emit for revoked session", () => {
      revocationPolicy.assert.mockImplementation(() => {
        throw new SessionRevokedError({ reason: "revoked" });
      });

      expect(() => guard.assert(validSession, 2000)).toThrow(SessionRevokedError);
      expect(events.sessionInvalid).toHaveBeenCalledWith({
        sessionId: "session1",
        at: 2000,
        reason: "revoked",
      });
    });

    it("should throw and emit for assurance required", () => {
      assurancePolicy.assert.mockImplementation(() => {
        throw new AssuranceRequiredError({ reason: "step_up", policy: "freshness" });
      });

      expect(() => guard.assert(validSession, 2000)).toThrow(AssuranceRequiredError);
      expect(events.sessionRejected).toHaveBeenCalledWith({
        sessionId: "session1",
        reason: "step_up",
        policy: "freshness",
      });
    });

    it("should emit sessionValidated with all optional fields", () => {
      const sessionWithOptionals = {
        ...validSession,
        verifiedAt: 1500,
        expiresAt: 5000,
        scopes: ["read", "write"],
      };

      guard.assert(sessionWithOptionals, 2000);

      expect(events.sessionValidated).toHaveBeenCalledWith({
        sessionId: "session1",
        assuranceScore: 1,
        createdAt: 1000,
        verifiedAt: 1500,
        expiresAt: 5000,
        scopes: ["read", "write"],
      });
    });

    it("should emit for revocation error without SessionRevokedError", () => {
      revocationPolicy.assert.mockImplementation(() => {
        throw new Error("Generic error");
      });

      expect(() => guard.assert(validSession, 2000)).toThrow(Error);
      expect(events.sessionInvalid).toHaveBeenCalledWith({
        sessionId: "session1",
        at: 2000,
      });
    });

    it("should emit for assurance error without AssuranceRequiredError", () => {
      assurancePolicy.assert.mockImplementation(() => {
        throw new Error("Generic error");
      });

      expect(() => guard.assert(validSession, 2000)).toThrow(Error);
      expect(events.sessionRejected).toHaveBeenCalledWith({
        sessionId: "session1",
      });
    });
  });

  describe("assertRefreshable", () => {
    const validSession = {
      id: "session1",
      createdAt: 1000,
      assurance: {
        methods: ["password"],
        score: 1,
        evaluatedAt: 1000,
        version: 1,
      },
      transport: "web",
      refresh: { enabled: true },
    };

    it("should validate refreshable session without refresh policy", () => {
      const guardNoRefresh = new AuthGuard(
        // @ts-expect-error
        { assurance: assurancePolicy, revocation: revocationPolicy },
        events
      );

      guardNoRefresh.assertRefreshable(validSession, 2000);
      expect(events.refreshValidated).not.toHaveBeenCalled();
    });

    it("should validate refreshable session with refresh policy", () => {
      guard.assertRefreshable(validSession, 2000);

      expect(refreshPolicy.assert).toHaveBeenCalledWith(validSession, 2000);
      expect(events.refreshValidated).toHaveBeenCalledWith({
        sessionId: "session1",
        at: 2000,
      });
    });

    it("should throw for refresh expired", () => {
      refreshPolicy.assert.mockImplementation(() => {
        throw new SessionRefreshExpiredError();
      });

      expect(() => guard.assertRefreshable(validSession, 2000)).toThrow(SessionRefreshExpiredError);
      expect(events.refreshRejected).toHaveBeenCalledWith({
        sessionId: "session1",
        at: 2000,
        reason: "refresh_expired",
      });
    });

    it("should throw for refresh not allowed", () => {
      refreshPolicy.assert.mockImplementation(() => {
        throw new SessionRefreshNotAllowedError({ reason: "disabled" });
      });

      expect(() => guard.assertRefreshable(validSession, 2000)).toThrow(
        SessionRefreshNotAllowedError
      );
      expect(events.refreshRejected).toHaveBeenCalledWith({
        sessionId: "session1",
        at: 2000,
        reason: "disabled",
      });
    });

    it("should emit refreshRejected for BaseError with reason", () => {
      const sessionWithRefresh = { ...validSession, refresh: { enabled: true, expiresAt: 3000 } };

      class CustomBaseError extends BaseError {
        readonly code = "test:custom";

        constructor(
          message: string,
          public meta: { reason: string }
        ) {
          super(message, meta);
        }
      }

      refreshPolicy.assert.mockImplementation(() => {
        throw new CustomBaseError("Custom error", { reason: "custom_reason" });
      });

      expect(() => guard.assertRefreshable(sessionWithRefresh, 2000)).toThrow(CustomBaseError);
      expect(events.refreshRejected).toHaveBeenCalledWith({
        sessionId: "session1",
        at: 3000,
        reason: "custom_reason",
      });
    });

    it("should rethrow non-BaseError errors", () => {
      refreshPolicy.assert.mockImplementation(() => {
        throw new Error("Generic error");
      });

      expect(() => guard.assertRefreshable(validSession, 2000)).toThrow(Error);
    });

    it("should call assert before checking refresh policy", () => {
      revocationPolicy.assert.mockImplementation(() => {
        throw new SessionRevokedError({ reason: "revoked" });
      });

      expect(() => guard.assertRefreshable(validSession, 2000)).toThrow(SessionRevokedError);
      expect(refreshPolicy.assert).not.toHaveBeenCalled();
    });
  });
});
