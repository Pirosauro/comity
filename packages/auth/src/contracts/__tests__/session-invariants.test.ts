import type { AuthSession } from "../session.js";

import { describe, expect, it } from "vitest";
import { AUTH_SESSION_INVARIANT_REASONS, checkSessionInvariants } from "../session-invariants.js";

describe("checkSessionInvariants", () => {
  const validSession: AuthSession = {
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

  describe("session id validation", () => {
    it("should pass with valid session id", () => {
      const result = checkSessionInvariants(validSession, 2000);

      expect(result.ok).toBe(true);
    });

    it("should fail when session id is missing", () => {
      const session = { ...validSession, id: "" };
      const result = checkSessionInvariants(session, 2000);

      expect(result.ok).toBe(false);

      if (!result.ok) {
        expect(result.error.meta["reason"]).toBe(AUTH_SESSION_INVARIANT_REASONS.SESSION_ID_MISSING);
      }
    });

    it("should fail when session id is not a string", () => {
      const session = { ...validSession, id: null as any };
      const result = checkSessionInvariants(session, 2000);

      expect(result.ok).toBe(false);

      if (!result.ok) {
        expect(result.error.meta["reason"]).toBe(AUTH_SESSION_INVARIANT_REASONS.SESSION_ID_MISSING);
      }
    });
  });

  describe("createdAt validation", () => {
    it("should fail when createdAt is not a number", () => {
      const session = { ...validSession, createdAt: "1000" as any };
      const result = checkSessionInvariants(session, 2000);

      expect(result.ok).toBe(false);

      if (!result.ok) {
        expect(result.error.meta["reason"]).toBe(AUTH_SESSION_INVARIANT_REASONS.CREATED_AT_INVALID);
      }
    });

    it("should fail when createdAt is negative", () => {
      const session = { ...validSession, createdAt: -1 };
      const result = checkSessionInvariants(session, 2000);

      expect(result.ok).toBe(false);

      if (!result.ok) {
        expect(result.error.meta["reason"]).toBe(AUTH_SESSION_INVARIANT_REASONS.CREATED_AT_INVALID);
      }
    });

    it("should fail when createdAt is zero", () => {
      const session = { ...validSession, createdAt: 0 };
      const result = checkSessionInvariants(session, 2000);

      expect(result.ok).toBe(false);

      if (!result.ok) {
        expect(result.error.meta["reason"]).toBe(AUTH_SESSION_INVARIANT_REASONS.CREATED_AT_INVALID);
      }
    });

    it("should fail when createdAt is in the future", () => {
      const session = { ...validSession, createdAt: 3000 };
      const result = checkSessionInvariants(session, 2000);

      expect(result.ok).toBe(false);

      if (!result.ok) {
        expect(result.error.meta["reason"]).toBe(AUTH_SESSION_INVARIANT_REASONS.CREATED_AT_INVALID);
      }
    });
  });

  describe("verifiedAt validation", () => {
    it("should pass when verifiedAt is valid", () => {
      const session = { ...validSession, verifiedAt: 1500 };
      const result = checkSessionInvariants(session, 2000);

      expect(result.ok).toBe(true);
    });

    it("should pass when verifiedAt is undefined", () => {
      const result = checkSessionInvariants(validSession, 2000);

      expect(result.ok).toBe(true);
    });

    it("should fail when verifiedAt is before createdAt", () => {
      const session = { ...validSession, verifiedAt: 500 };
      const result = checkSessionInvariants(session, 2000);

      expect(result.ok).toBe(false);

      if (!result.ok) {
        expect(result.error.meta["reason"]).toBe(
          AUTH_SESSION_INVARIANT_REASONS.VERIFIED_AT_INVALID
        );
      }
    });
  });

  describe("expiresAt validation", () => {
    it("should pass when expiresAt is valid", () => {
      const session = { ...validSession, expiresAt: 3000 };
      const result = checkSessionInvariants(session, 2000);

      expect(result.ok).toBe(true);
    });

    it("should pass when expiresAt is undefined", () => {
      const result = checkSessionInvariants(validSession, 2000);

      expect(result.ok).toBe(true);
    });

    it("should fail when expiresAt is before or equal to createdAt", () => {
      const session = { ...validSession, expiresAt: 1000 };
      const result = checkSessionInvariants(session, 2000);

      expect(result.ok).toBe(false);

      if (!result.ok) {
        expect(result.error.meta["reason"]).toBe(AUTH_SESSION_INVARIANT_REASONS.EXPIRES_AT_INVALID);
      }
    });

    it("should fail when expiresAt is before createdAt", () => {
      const session = { ...validSession, expiresAt: 500 };
      const result = checkSessionInvariants(session, 2000);

      expect(result.ok).toBe(false);

      if (!result.ok) {
        expect(result.error.meta["reason"]).toBe(AUTH_SESSION_INVARIANT_REASONS.EXPIRES_AT_INVALID);
      }
    });
  });

  describe("assurance validation", () => {
    it("should fail when assurance is missing", () => {
      const session = { ...validSession, assurance: null as any };
      const result = checkSessionInvariants(session, 2000);

      expect(result.ok).toBe(false);

      if (!result.ok) {
        expect(result.error.meta["reason"]).toBe(AUTH_SESSION_INVARIANT_REASONS.ASSURANCE_MISSING);
      }
    });

    it("should fail when assurance is undefined", () => {
      const session = { ...validSession, assurance: undefined as any };
      const result = checkSessionInvariants(session, 2000);

      expect(result.ok).toBe(false);

      if (!result.ok) {
        expect(result.error.meta["reason"]).toBe(AUTH_SESSION_INVARIANT_REASONS.ASSURANCE_MISSING);
      }
    });
  });

  describe("assurance methods validation", () => {
    it("should fail when methods is not an array", () => {
      const session = {
        ...validSession,
        assurance: { ...validSession.assurance, methods: "password" as any },
      };
      const result = checkSessionInvariants(session, 2000);

      expect(result.ok).toBe(false);

      if (!result.ok) {
        expect(result.error.meta["reason"]).toBe(
          AUTH_SESSION_INVARIANT_REASONS.ASSURANCE_METHODS_INVALID
        );
      }
    });

    it("should fail when methods is empty array", () => {
      const session = { ...validSession, assurance: { ...validSession.assurance, methods: [] } };
      const result = checkSessionInvariants(session, 2000);

      expect(result.ok).toBe(false);

      if (!result.ok) {
        expect(result.error.meta["reason"]).toBe(
          AUTH_SESSION_INVARIANT_REASONS.ASSURANCE_METHODS_INVALID
        );
      }
    });
  });

  describe("assurance proof validation", () => {
    it("should pass when proof is a string", () => {
      const session = {
        ...validSession,
        assurance: { ...validSession.assurance, proof: "proof-data" },
      };
      const result = checkSessionInvariants(session, 2000);

      expect(result.ok).toBe(true);
    });

    it("should pass when proof is undefined", () => {
      const result = checkSessionInvariants(validSession, 2000);

      expect(result.ok).toBe(true);
    });

    it("should fail when proof is not a string", () => {
      const session = {
        ...validSession,
        assurance: { ...validSession.assurance, proof: 123 as any },
      };
      const result = checkSessionInvariants(session, 2000);

      expect(result.ok).toBe(false);

      if (!result.ok) {
        expect(result.error.meta["reason"]).toBe(
          AUTH_SESSION_INVARIANT_REASONS.ASSURANCE_PROOF_INVALID
        );
      }
    });
  });

  describe("assurance score validation", () => {
    it("should fail when score is not a number", () => {
      const session = {
        ...validSession,
        assurance: { ...validSession.assurance, score: "1" as any },
      };

      const result = checkSessionInvariants(session, 2000);

      expect(result.ok).toBe(false);

      if (!result.ok) {
        expect(result.error.meta["reason"]).toBe(
          AUTH_SESSION_INVARIANT_REASONS.ASSURANCE_SCORE_INVALID
        );
      }
    });

    it("should fail when score is negative", () => {
      const session = { ...validSession, assurance: { ...validSession.assurance, score: -1 } };
      const result = checkSessionInvariants(session, 2000);

      expect(result.ok).toBe(false);

      if (!result.ok) {
        expect(result.error.meta["reason"]).toBe(
          AUTH_SESSION_INVARIANT_REASONS.ASSURANCE_SCORE_INVALID
        );
      }
    });

    it("should pass when score is zero", () => {
      const session = { ...validSession, assurance: { ...validSession.assurance, score: 0 } };
      const result = checkSessionInvariants(session, 2000);

      expect(result.ok).toBe(true);
    });
  });

  describe("assurance evaluatedAt validation", () => {
    it("should fail when evaluatedAt is not a number", () => {
      const session = {
        ...validSession,
        assurance: { ...validSession.assurance, evaluatedAt: "1000" as any },
      };

      const result = checkSessionInvariants(session, 2000);

      expect(result.ok).toBe(false);

      if (!result.ok) {
        expect(result.error.meta["reason"]).toBe(
          AUTH_SESSION_INVARIANT_REASONS.ASSURANCE_EVALUATED_AT_INVALID
        );
      }
    });

    it("should fail when evaluatedAt is negative", () => {
      const session = {
        ...validSession,
        assurance: { ...validSession.assurance, evaluatedAt: -1 },
      };

      const result = checkSessionInvariants(session, 2000);

      expect(result.ok).toBe(false);

      if (!result.ok) {
        expect(result.error.meta["reason"]).toBe(
          AUTH_SESSION_INVARIANT_REASONS.ASSURANCE_EVALUATED_AT_INVALID
        );
      }
    });

    it("should fail when evaluatedAt is zero", () => {
      const session = { ...validSession, assurance: { ...validSession.assurance, evaluatedAt: 0 } };
      const result = checkSessionInvariants(session, 2000);

      expect(result.ok).toBe(false);

      if (!result.ok) {
        expect(result.error.meta["reason"]).toBe(
          AUTH_SESSION_INVARIANT_REASONS.ASSURANCE_EVALUATED_AT_INVALID
        );
      }
    });

    it("should fail when evaluatedAt is in the future", () => {
      const session = {
        ...validSession,
        assurance: { ...validSession.assurance, evaluatedAt: 3000 },
      };
      const result = checkSessionInvariants(session, 2000);

      expect(result.ok).toBe(false);

      if (!result.ok) {
        expect(result.error.meta["reason"]).toBe(
          AUTH_SESSION_INVARIANT_REASONS.ASSURANCE_EVALUATED_AT_INVALID
        );
      }
    });
  });

  describe("assurance version validation", () => {
    it("should fail when version is not a number", () => {
      const session = {
        ...validSession,
        assurance: { ...validSession.assurance, version: "1" as any },
      };
      const result = checkSessionInvariants(session, 2000);

      expect(result.ok).toBe(false);

      if (!result.ok) {
        expect(result.error.meta["reason"]).toBe(
          AUTH_SESSION_INVARIANT_REASONS.ASSURANCE_VERSION_INVALID
        );
      }
    });

    it("should fail when version is negative", () => {
      const session = { ...validSession, assurance: { ...validSession.assurance, version: -1 } };
      const result = checkSessionInvariants(session, 2000);

      expect(result.ok).toBe(false);

      if (!result.ok) {
        expect(result.error.meta["reason"]).toBe(
          AUTH_SESSION_INVARIANT_REASONS.ASSURANCE_VERSION_INVALID
        );
      }
    });

    it("should pass when version is zero", () => {
      const session = { ...validSession, assurance: { ...validSession.assurance, version: 0 } };
      const result = checkSessionInvariants(session, 2000);

      expect(result.ok).toBe(true);
    });
  });

  describe("assurance context validation", () => {
    it("should pass when context is a valid object", () => {
      const session = {
        ...validSession,
        assurance: {
          ...validSession.assurance,
          context: { identityId: "user1", ipAddress: "127.0.0.1" },
        },
      };
      const result = checkSessionInvariants(session, 2000);

      expect(result.ok).toBe(true);
    });

    it("should pass when context is undefined", () => {
      const result = checkSessionInvariants(validSession, 2000);

      expect(result.ok).toBe(true);
    });

    it("should fail when context is null", () => {
      const session = {
        ...validSession,
        assurance: { ...validSession.assurance, context: null as any },
      };
      const result = checkSessionInvariants(session, 2000);

      expect(result.ok).toBe(false);

      if (!result.ok) {
        expect(result.error.meta["reason"]).toBe(
          AUTH_SESSION_INVARIANT_REASONS.ASSURANCE_CONTEXT_INVALID
        );
      }
    });

    it("should fail when context is not an object", () => {
      const session = {
        ...validSession,
        assurance: { ...validSession.assurance, context: "context" as any },
      };
      const result = checkSessionInvariants(session, 2000);

      expect(result.ok).toBe(false);

      if (!result.ok) {
        expect(result.error.meta["reason"]).toBe(
          AUTH_SESSION_INVARIANT_REASONS.ASSURANCE_CONTEXT_INVALID
        );
      }
    });
  });

  describe("transport validation", () => {
    it("should fail when transport is not a string", () => {
      const session = { ...validSession, transport: 123 as any };
      const result = checkSessionInvariants(session, 2000);

      expect(result.ok).toBe(false);

      if (!result.ok) {
        expect(result.error.meta["reason"]).toBe(
          AUTH_SESSION_INVARIANT_REASONS.SESSION_TRANSPORT_INVALID
        );
      }
    });

    it("should fail when transport is empty string", () => {
      const session = { ...validSession, transport: "" };
      const result = checkSessionInvariants(session, 2000);

      expect(result.ok).toBe(false);

      if (!result.ok) {
        expect(result.error.meta["reason"]).toBe(
          AUTH_SESSION_INVARIANT_REASONS.SESSION_TRANSPORT_INVALID
        );
      }
    });
  });

  describe("refresh validation", () => {
    it("should pass when refresh is valid", () => {
      const session = { ...validSession, refresh: { enabled: true, expiresAt: 3000 } };
      const result = checkSessionInvariants(session, 2000);

      expect(result.ok).toBe(true);
    });

    it("should pass when refresh is undefined", () => {
      const result = checkSessionInvariants(validSession, 2000);

      expect(result.ok).toBe(true);
    });

    it("should fail when refresh.enabled is not a boolean", () => {
      const session = { ...validSession, refresh: { enabled: "true" as any } };
      const result = checkSessionInvariants(session, 2000);

      expect(result.ok).toBe(false);

      if (!result.ok) {
        expect(result.error.meta["reason"]).toBe(
          AUTH_SESSION_INVARIANT_REASONS.REFRESH_ENABLED_INVALID
        );
      }
    });

    it("should fail when refresh.expiresAt is before or equal to createdAt", () => {
      const session = { ...validSession, refresh: { enabled: true, expiresAt: 1000 } };
      const result = checkSessionInvariants(session, 2000);

      expect(result.ok).toBe(false);

      if (!result.ok) {
        expect(result.error.meta["reason"]).toBe(
          AUTH_SESSION_INVARIANT_REASONS.REFRESH_EXPIRES_AT_INVALID
        );
      }
    });

    it("should pass when refresh.expiresAt is undefined", () => {
      const session = { ...validSession, refresh: { enabled: true } };
      const result = checkSessionInvariants(session, 2000);

      expect(result.ok).toBe(true);
    });
  });

  describe("stepUp validation", () => {
    it("should pass when stepUp is valid", () => {
      const session = { ...validSession, stepUp: { parent: "parent-session", at: 1500 } };
      const result = checkSessionInvariants(session, 2000);

      expect(result.ok).toBe(true);
    });

    it("should pass when stepUp is undefined", () => {
      const result = checkSessionInvariants(validSession, 2000);

      expect(result.ok).toBe(true);
    });

    it("should fail when stepUp.parent is not a string", () => {
      const session = { ...validSession, stepUp: { parent: 123 as any, at: 1500 } };
      const result = checkSessionInvariants(session, 2000);

      expect(result.ok).toBe(false);

      if (!result.ok) {
        expect(result.error.meta["reason"]).toBe(
          AUTH_SESSION_INVARIANT_REASONS.STEP_UP_PARENT_INVALID
        );
      }
    });

    it("should fail when stepUp.parent is empty string", () => {
      const session = { ...validSession, stepUp: { parent: "", at: 1500 } };
      const result = checkSessionInvariants(session, 2000);

      expect(result.ok).toBe(false);

      if (!result.ok) {
        expect(result.error.meta["reason"]).toBe(
          AUTH_SESSION_INVARIANT_REASONS.STEP_UP_PARENT_INVALID
        );
      }
    });

    it("should fail when stepUp.at is not a number", () => {
      const session = { ...validSession, stepUp: { parent: "parent", at: "1500" as any } };
      const result = checkSessionInvariants(session, 2000);

      expect(result.ok).toBe(false);

      if (!result.ok) {
        expect(result.error.meta["reason"]).toBe(AUTH_SESSION_INVARIANT_REASONS.STEP_UP_AT_INVALID);
      }
    });

    it("should fail when stepUp.at is negative", () => {
      const session = { ...validSession, stepUp: { parent: "parent", at: -1 } };
      const result = checkSessionInvariants(session, 2000);

      expect(result.ok).toBe(false);

      if (!result.ok) {
        expect(result.error.meta["reason"]).toBe(AUTH_SESSION_INVARIANT_REASONS.STEP_UP_AT_INVALID);
      }
    });

    it("should fail when stepUp.at is zero", () => {
      const session = { ...validSession, stepUp: { parent: "parent", at: 0 } };
      const result = checkSessionInvariants(session, 2000);

      expect(result.ok).toBe(false);

      if (!result.ok) {
        expect(result.error.meta["reason"]).toBe(AUTH_SESSION_INVARIANT_REASONS.STEP_UP_AT_INVALID);
      }
    });

    it("should fail when stepUp.at is in the future", () => {
      const session = { ...validSession, stepUp: { parent: "parent", at: 3000 } };
      const result = checkSessionInvariants(session, 2000);

      expect(result.ok).toBe(false);

      if (!result.ok) {
        expect(result.error.meta["reason"]).toBe(AUTH_SESSION_INVARIANT_REASONS.STEP_UP_AT_INVALID);
      }
    });
  });
});
