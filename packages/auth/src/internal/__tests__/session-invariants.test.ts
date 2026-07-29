import type { AuthSession } from "../../contracts/session.js";

import { describe, expect, it } from "vitest";
import { AuthError } from "../../errors/auth.js";
import { checkSessionInvariants } from "../session-invariants.js";

describe("checkSessionInvariants", () => {
  const validSession: AuthSession = {
    id: "session-123",
    createdAt: 1000,
    verifiedAt: 1000,
    assurance: {
      methods: ["password"],
      score: 100,
      evaluatedAt: 1000,
      version: 1,
    },
    transport: { type: "bearer" },
  };

  describe("session id validation", () => {
    it("should pass with valid id", () => {
      const result = checkSessionInvariants(validSession, 2000);

      expect(result.ok).toBe(true);
    });

    it("should fail with empty id", () => {
      const result = checkSessionInvariants({ ...validSession, id: "" }, 2000);

      expect(result.ok).toBe(false);

      if (!result.ok) {
        expect(result.error).toBeInstanceOf(AuthError);
        expect(result.error.meta.details?.violation).toBe("session_id_missing");
      }
    });

    it("should fail with non-string id", () => {
      const result = checkSessionInvariants({ ...validSession, id: 123 as any }, 2000);

      expect(result.ok).toBe(false);

      if (!result.ok) {
        expect(result.error.meta.details?.violation).toBe("session_id_missing");
      }
    });
  });

  describe("createdAt validation", () => {
    it("should pass with valid createdAt", () => {
      const result = checkSessionInvariants(validSession, 2000);

      expect(result.ok).toBe(true);
    });

    it("should fail with createdAt in future", () => {
      const result = checkSessionInvariants({ ...validSession, createdAt: 3000 }, 2000);

      expect(result.ok).toBe(false);

      if (!result.ok) {
        expect(result.error.meta.details?.violation).toBe("created_at_invalid");
      }
    });

    it("should fail with zero createdAt", () => {
      const result = checkSessionInvariants({ ...validSession, createdAt: 0 }, 2000);

      expect(result.ok).toBe(false);

      if (!result.ok) {
        expect(result.error.meta.details?.violation).toBe("created_at_invalid");
      }
    });

    it("should fail with negative createdAt", () => {
      const result = checkSessionInvariants({ ...validSession, createdAt: -1000 }, 2000);

      expect(result.ok).toBe(false);

      if (!result.ok) {
        expect(result.error.meta.details?.violation).toBe("created_at_invalid");
      }
    });

    it("should fail with non-number createdAt", () => {
      const result = checkSessionInvariants({ ...validSession, createdAt: "1000" as any }, 2000);

      expect(result.ok).toBe(false);

      if (!result.ok) {
        expect(result.error.meta.details?.violation).toBe("created_at_invalid");
      }
    });
  });

  describe("verifiedAt validation", () => {
    it("should pass with verifiedAt >= createdAt", () => {
      const result = checkSessionInvariants({ ...validSession, verifiedAt: 1000 }, 2000);

      expect(result.ok).toBe(true);
    });

    it("should fail with verifiedAt < createdAt", () => {
      const result = checkSessionInvariants({ ...validSession, verifiedAt: 900 }, 2000);

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.meta.details?.violation).toBe("verified_at_invalid");
      }
    });

    it("should allow undefined verifiedAt", () => {
      const session = { ...validSession } as any;

      delete session.verifiedAt;

      const result = checkSessionInvariants(session, 2000);

      expect(result.ok).toBe(true);
    });
  });

  describe("expiresAt validation", () => {
    it("should pass with expiresAt > createdAt", () => {
      const result = checkSessionInvariants({ ...validSession, expiresAt: 3000 }, 2000);

      expect(result.ok).toBe(true);
    });

    it("should fail with expiresAt = createdAt", () => {
      const result = checkSessionInvariants({ ...validSession, expiresAt: 1000 }, 2000);

      expect(result.ok).toBe(false);

      if (!result.ok) {
        expect(result.error.meta.details?.violation).toBe("expires_at_invalid");
      }
    });

    it("should fail with expiresAt < createdAt", () => {
      const result = checkSessionInvariants({ ...validSession, expiresAt: 500 }, 2000);

      expect(result.ok).toBe(false);

      if (!result.ok) {
        expect(result.error.meta.details?.violation).toBe("expires_at_invalid");
      }
    });

    it("should allow undefined expiresAt", () => {
      const session = { ...validSession } as any;

      delete session.expiresAt;

      const result = checkSessionInvariants(session, 2000);

      expect(result.ok).toBe(true);
    });
  });

  describe("assurance validation", () => {
    it("should fail with missing assurance", () => {
      const session = { ...validSession } as any;

      delete session.assurance;

      const result = checkSessionInvariants(session, 2000);

      expect(result.ok).toBe(false);

      if (!result.ok) {
        expect(result.error.meta.details?.violation).toBe("assurance_missing");
      }
    });

    it("should fail with null assurance", () => {
      const result = checkSessionInvariants({ ...validSession, assurance: null as any }, 2000);

      expect(result.ok).toBe(false);

      if (!result.ok) {
        expect(result.error.meta.details?.violation).toBe("assurance_missing");
      }
    });

    describe("methods validation", () => {
      it("should fail with empty methods array", () => {
        const result = checkSessionInvariants(
          {
            ...validSession,
            assurance: { ...validSession.assurance, methods: [] },
          },
          2000
        );

        expect(result.ok).toBe(false);

        if (!result.ok) {
          expect(result.error.meta.details?.violation).toBe("assurance_methods_invalid");
        }
      });

      it("should fail with non-array methods", () => {
        const result = checkSessionInvariants(
          {
            ...validSession,
            assurance: { ...validSession.assurance, methods: "password" as any },
          },
          2000
        );

        expect(result.ok).toBe(false);

        if (!result.ok) {
          expect(result.error.meta.details?.violation).toBe("assurance_methods_invalid");
        }
      });

      it("should pass with valid methods array", () => {
        const result = checkSessionInvariants(validSession, 2000);
        expect(result.ok).toBe(true);
      });
    });

    describe("proof validation", () => {
      it("should allow undefined proof", () => {
        const session = {
          ...validSession,
          assurance: { ...validSession.assurance },
        } as any;

        delete session.assurance.proof;

        const result = checkSessionInvariants(session, 2000);

        expect(result.ok).toBe(true);
      });

      it("should allow string proof", () => {
        const result = checkSessionInvariants(
          {
            ...validSession,
            assurance: { ...validSession.assurance, proof: "proof-value" },
          },
          2000
        );

        expect(result.ok).toBe(true);
      });

      it("should fail with non-string proof", () => {
        const result = checkSessionInvariants(
          {
            ...validSession,
            assurance: { ...validSession.assurance, proof: 123 as any },
          },
          2000
        );

        expect(result.ok).toBe(false);

        if (!result.ok) {
          expect(result.error.meta.details?.violation).toBe("assurance_proof_invalid");
        }
      });
    });

    describe("score validation", () => {
      it("should pass with valid score", () => {
        const result = checkSessionInvariants(
          {
            ...validSession,
            assurance: { ...validSession.assurance, score: 100 },
          },
          2000
        );

        expect(result.ok).toBe(true);
      });

      it("should pass with score 0", () => {
        const result = checkSessionInvariants(
          {
            ...validSession,
            assurance: { ...validSession.assurance, score: 0 },
          },
          2000
        );

        expect(result.ok).toBe(true);
      });

      it("should fail with negative score", () => {
        const result = checkSessionInvariants(
          {
            ...validSession,
            assurance: { ...validSession.assurance, score: -1 },
          },
          2000
        );

        expect(result.ok).toBe(false);

        if (!result.ok) {
          expect(result.error.meta.details?.violation).toBe("assurance_score_invalid");
        }
      });

      it("should fail with non-number score", () => {
        const result = checkSessionInvariants(
          {
            ...validSession,
            assurance: { ...validSession.assurance, score: "100" as any },
          },
          2000
        );

        expect(result.ok).toBe(false);

        if (!result.ok) {
          expect(result.error.meta.details?.violation).toBe("assurance_score_invalid");
        }
      });
    });

    describe("evaluatedAt validation", () => {
      it("should pass with valid evaluatedAt", () => {
        const result = checkSessionInvariants(
          {
            ...validSession,
            assurance: { ...validSession.assurance, evaluatedAt: 1000 },
          },
          2000
        );

        expect(result.ok).toBe(true);
      });

      it("should fail with evaluatedAt in future", () => {
        const result = checkSessionInvariants(
          {
            ...validSession,
            assurance: { ...validSession.assurance, evaluatedAt: 3000 },
          },
          2000
        );

        expect(result.ok).toBe(false);

        if (!result.ok) {
          expect(result.error.meta.details?.violation).toBe("assurance_evaluated_at_invalid");
        }
      });

      it("should fail with zero evaluatedAt", () => {
        const result = checkSessionInvariants(
          {
            ...validSession,
            assurance: { ...validSession.assurance, evaluatedAt: 0 },
          },
          2000
        );

        expect(result.ok).toBe(false);

        if (!result.ok) {
          expect(result.error.meta.details?.violation).toBe("assurance_evaluated_at_invalid");
        }
      });
    });

    describe("version validation", () => {
      it("should pass with valid version", () => {
        const result = checkSessionInvariants(
          {
            ...validSession,
            assurance: { ...validSession.assurance, version: 1 },
          },
          2000
        );

        expect(result.ok).toBe(true);
      });

      it("should pass with version 0", () => {
        const result = checkSessionInvariants(
          {
            ...validSession,
            assurance: { ...validSession.assurance, version: 0 },
          },
          2000
        );

        expect(result.ok).toBe(true);
      });

      it("should fail with negative version", () => {
        const result = checkSessionInvariants(
          {
            ...validSession,
            assurance: { ...validSession.assurance, version: -1 },
          },
          2000
        );

        expect(result.ok).toBe(false);

        if (!result.ok) {
          expect(result.error.meta.details?.violation).toBe("assurance_version_invalid");
        }
      });
    });

    describe("context validation", () => {
      it("should allow undefined context", () => {
        const session = {
          ...validSession,
          assurance: { ...validSession.assurance },
        } as any;

        delete session.assurance.context;

        const result = checkSessionInvariants(session, 2000);

        expect(result.ok).toBe(true);
      });

      it("should allow object context", () => {
        const result = checkSessionInvariants(
          {
            ...validSession,
            assurance: {
              ...validSession.assurance,
              context: { ipAddress: "192.168.1.1" },
            },
          },
          2000
        );

        expect(result.ok).toBe(true);
      });

      it("should fail with null context", () => {
        const result = checkSessionInvariants(
          {
            ...validSession,
            assurance: {
              ...validSession.assurance,
              context: null as any,
            },
          },
          2000
        );

        expect(result.ok).toBe(false);

        if (!result.ok) {
          expect(result.error.meta.details?.violation).toBe("assurance_context_invalid");
        }
      });

      it("should fail with non-object context", () => {
        const result = checkSessionInvariants(
          {
            ...validSession,
            assurance: {
              ...validSession.assurance,
              context: "not-an-object" as any,
            },
          },
          2000
        );

        expect(result.ok).toBe(false);

        if (!result.ok) {
          expect(result.error.meta.details?.violation).toBe("assurance_context_invalid");
        }
      });
    });
  });

  describe("transport validation", () => {
    it("should pass with valid transport", () => {
      const result = checkSessionInvariants(validSession, 2000);

      expect(result.ok).toBe(true);
    });

    it("should fail with missing transport", () => {
      const session = { ...validSession } as any;

      delete session.transport;

      const result = checkSessionInvariants(session, 2000);

      expect(result.ok).toBe(false);

      if (!result.ok) {
        expect(result.error.meta.details?.violation).toBe("session_transport_invalid");
      }
    });

    it("should fail with empty type", () => {
      const result = checkSessionInvariants({ ...validSession, transport: { type: "" } }, 2000);

      expect(result.ok).toBe(false);

      if (!result.ok) {
        expect(result.error.meta.details?.violation).toBe("session_transport_invalid");
      }
    });

    it("should fail with non-string type", () => {
      const result = checkSessionInvariants(
        { ...validSession, transport: { type: 123 as any } },
        2000
      );

      expect(result.ok).toBe(false);

      if (!result.ok) {
        expect(result.error.meta.details?.violation).toBe("session_transport_invalid");
      }
    });
  });

  describe("refresh validation", () => {
    it("should allow missing refresh", () => {
      const session = { ...validSession } as any;

      delete session.refresh;

      const result = checkSessionInvariants(session, 2000);

      expect(result.ok).toBe(true);
    });

    it("should fail with non-boolean enabled", () => {
      const result = checkSessionInvariants(
        {
          ...validSession,
          refresh: { enabled: "true" as any },
        },
        2000
      );

      expect(result.ok).toBe(false);

      if (!result.ok) {
        expect(result.error.meta.details?.violation).toBe("refresh_enabled_invalid");
      }
    });

    it("should pass with valid refresh enabled", () => {
      const result = checkSessionInvariants({ ...validSession, refresh: { enabled: true } }, 2000);

      expect(result.ok).toBe(true);
    });

    it("should fail with expiresAt <= createdAt", () => {
      const result = checkSessionInvariants(
        {
          ...validSession,
          refresh: { enabled: true, expiresAt: 1000 },
        },
        2000
      );

      expect(result.ok).toBe(false);

      if (!result.ok) {
        expect(result.error.meta.details?.violation).toBe("refresh_expires_at_invalid");
      }
    });

    it("should pass with expiresAt > createdAt", () => {
      const result = checkSessionInvariants(
        {
          ...validSession,
          refresh: { enabled: true, expiresAt: 3000 },
        },
        2000
      );

      expect(result.ok).toBe(true);
    });
  });

  describe("stepUp validation", () => {
    it("should allow missing stepUp", () => {
      const session = { ...validSession } as any;

      delete session.stepUp;

      const result = checkSessionInvariants(session, 2000);

      expect(result.ok).toBe(true);
    });

    it("should fail with empty parent", () => {
      const result = checkSessionInvariants(
        {
          ...validSession,
          stepUp: { parent: "", at: 1000 },
        },
        2000
      );

      expect(result.ok).toBe(false);

      if (!result.ok) {
        expect(result.error.meta.details?.violation).toBe("step_up_parent_invalid");
      }
    });

    it("should fail with non-string parent", () => {
      const result = checkSessionInvariants(
        {
          ...validSession,
          stepUp: { parent: 123 as any, at: 1000 },
        },
        2000
      );

      expect(result.ok).toBe(false);

      if (!result.ok) {
        expect(result.error.meta.details?.violation).toBe("step_up_parent_invalid");
      }
    });

    it("should fail with at in future", () => {
      const result = checkSessionInvariants(
        {
          ...validSession,
          stepUp: { parent: "parent-id", at: 3000 },
        },
        2000
      );

      expect(result.ok).toBe(false);

      if (!result.ok) {
        expect(result.error.meta.details?.violation).toBe("step_up_at_invalid");
      }
    });

    it("should fail with zero at", () => {
      const result = checkSessionInvariants(
        {
          ...validSession,
          stepUp: { parent: "parent-id", at: 0 },
        },
        2000
      );

      expect(result.ok).toBe(false);

      if (!result.ok) {
        expect(result.error.meta.details?.violation).toBe("step_up_at_invalid");
      }
    });

    it("should pass with valid stepUp", () => {
      const result = checkSessionInvariants(
        {
          ...validSession,
          stepUp: { parent: "parent-id", at: 1000 },
        },
        2000
      );

      expect(result.ok).toBe(true);
    });
  });

  describe("success case", () => {
    it("should validate fully valid session", () => {
      const session: AuthSession = {
        id: "session-123",
        createdAt: 1000,
        expiresAt: 5000,
        verifiedAt: 1500,
        assurance: {
          methods: ["password"],
          proof: "proof-value",
          context: { ipAddress: "192.168.1.1" },
          score: 100,
          evaluatedAt: 1000,
          version: 1,
        },
        transport: { type: "bearer" },
        refresh: { enabled: true, expiresAt: 4000 },
        stepUp: { parent: "parent-id", at: 1200 },
      };

      const result = checkSessionInvariants(session, 2000);

      expect(result.ok).toBe(true);

      if (result.ok) {
        expect(result.value).toBeUndefined();
      }
    });
  });
});
