import { AuthSessionId } from "@comity/auth";
import { describe, expect, it } from "vitest";
import { jwtPayloadToAuthSession } from "../jwt-to-session.js";

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

    const session = jwtPayloadToAuthSession(payload);

    expect(session).toEqual({
      id: new AuthSessionId("session-1"),
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
        parent: new AuthSessionId("session-root"),
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
    const session = jwtPayloadToAuthSession(payload);

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
    const session = jwtPayloadToAuthSession(payload);

    expect(session.refresh).toEqual({ enabled: true });
  });
});
