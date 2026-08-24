import type { AuthSession } from "@comity/auth";
import { AuthSessionId } from "@comity/auth";
import type { Result } from "@comity/primitives/result";
import { isFailure } from "@comity/primitives/result";
import { describe, expect, it } from "vitest";
import { jwtPayloadToAuthSession } from "../jwt-to-session.js";

function makeSessionId(value: string): AuthSessionId {
  const result = AuthSessionId.create(value);

  if (isFailure(result)) {
    throw new Error("Unexpected failure");
  }

  return result.value;
}

function unwrap(result: Result<AuthSession, unknown>): AuthSession {
  if (isFailure(result)) {
    throw new Error("Unexpected failure");
  }

  return result.value;
}

describe("jwtPayloadToAuthSession", () => {
  it("maps payload with all optional fields", () => {
    const payload = {
      sid: "session-1",
      iat: 1000,
      exp: 2000,
      vat: 1500,
      ass: {
        methods: ["password"],
        score: 3,
        evaluatedAt: 1000,
        version: 1,
      },
      scopes: ["a", "b"],
      refresh: {
        enabled: true,
        exp: 3000,
      },
      stepUp: {
        parent: "session-root",
        at: 1200,
      },
    };

    const result = jwtPayloadToAuthSession(payload);

    expect(unwrap(result)).toEqual({
      id: makeSessionId("session-1"),
      transport: { type: "jwt" },
      createdAt: 1000 * 1000,
      verifiedAt: 1500 * 1000,
      expiresAt: 2000 * 1000,
      assurance: payload.ass,
      refresh: {
        enabled: true,
        expiresAt: 3000 * 1000,
      },
      stepUp: {
        parent: makeSessionId("session-root"),
        at: 1200 * 1000,
      },
      scopes: ["a", "b"],
    });
  });

  it("falls back to issued-at when verified-at is missing", () => {
    const payload = {
      sid: "session-2",
      iat: 1000,
      ass: {
        methods: ["password"],
        score: 1,
        evaluatedAt: 1000,
        version: 1,
      },
    };
    const session = unwrap(jwtPayloadToAuthSession(payload));

    expect(session.verifiedAt).toBe(1000 * 1000);
    expect(session.expiresAt).toBeUndefined();
    expect(session.refresh).toBeUndefined();
    expect(session.stepUp).toBeUndefined();
    expect(session.scopes).toBeUndefined();
  });

  it("keeps refresh without expiration", () => {
    const payload = {
      sid: "session-3",
      iat: 1000,
      ass: {
        methods: ["password"],
        score: 1,
        evaluatedAt: 1000,
        version: 1,
      },
      refresh: {
        enabled: true,
      },
    };
    const session = unwrap(jwtPayloadToAuthSession(payload));

    expect(session.refresh).toEqual({ enabled: true });
  });

  it("returns a failure when the session id is invalid", () => {
    const result = jwtPayloadToAuthSession({
      sid: "   ",
      iat: 1000,
      ass: {
        methods: ["password"],
        score: 1,
        evaluatedAt: 1000,
        version: 1,
      },
    });

    expect(isFailure(result)).toBe(true);

    if (isFailure(result)) {
      expect(result.error.meta.reason).toBe("token_invalid");
      expect(result.error.meta.details?.violation).toBe("session_id_missing");
    }
  });

  it("returns a failure when the step-up parent id is invalid", () => {
    const result = jwtPayloadToAuthSession({
      sid: "session-4",
      iat: 1000,
      ass: {
        methods: ["password"],
        score: 1,
        evaluatedAt: 1000,
        version: 1,
      },
      stepUp: {
        parent: "",
        at: 1200,
      },
    });

    expect(isFailure(result)).toBe(true);

    if (isFailure(result)) {
      expect(result.error.meta.reason).toBe("token_invalid");
      expect(result.error.meta.details?.violation).toBe("step_up_parent_invalid");
    }
  });
});
