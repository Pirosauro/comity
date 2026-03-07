import { describe, expect, it } from "vitest";
import { authSessionToJwtPayload } from "../session-to-jwt.js";

describe("authSessionToJwtPayload", () => {
  it("maps session with optional fields", () => {
    const session = {
      id: "session-1",
      createdAt: 1000500,
      verifiedAt: 1002500,
      expiresAt: 1009500,
      assurance: {
        methods: ["password"],
        score: 2,
        evaluatedAt: 1000000,
        version: 1,
      },
      transport: { type: "jwt" },
      refresh: {
        enabled: true,
        expiresAt: 2000500,
      },
      stepUp: {
        parent: "session-root",
        at: 1200500,
      },
      scopes: ["read", "write"],
    };
    const payload = authSessionToJwtPayload(session);

    expect(payload).toEqual({
      sid: "session-1",
      iat: 1000,
      exp: 1009,
      vat: 1002,
      ass: session.assurance,
      refresh: {
        enabled: true,
        exp: 2000,
      },
      stepUp: {
        parent: "session-root",
        at: 1200,
      },
      scopes: ["read", "write"],
    });
  });

  it("omits optional fields when absent", () => {
    const session = {
      id: "session-2",
      createdAt: 1000000,
      verifiedAt: 1000000,
      assurance: {
        methods: ["password"],
        score: 1,
        evaluatedAt: 1000000,
        version: 1,
      },
      transport: { type: "jwt" },
    };
    const payload = authSessionToJwtPayload(session);

    expect(payload).toEqual({
      sid: "session-2",
      iat: 1000,
      vat: 1000,
      ass: session.assurance,
    });
  });

  it("preserves refresh without expiration", () => {
    const session = {
      id: "session-3",
      createdAt: 1000000,
      verifiedAt: 1000000,
      assurance: {
        methods: ["password"],
        score: 1,
        evaluatedAt: 1000000,
        version: 1,
      },
      transport: { type: "jwt" },
      refresh: {
        enabled: true,
      },
    };
    const payload = authSessionToJwtPayload(session);

    expect(payload.refresh).toEqual({ enabled: true });
    expect(payload.exp).toBeUndefined();
  });

  it("omits verified-at when value is zero", () => {
    const session = {
      id: "session-4",
      createdAt: 1000000,
      verifiedAt: 0,
      assurance: {
        methods: ["password"],
        score: 1,
        evaluatedAt: 1000000,
        version: 1,
      },
      transport: { type: "jwt" },
    };
    const payload = authSessionToJwtPayload(session);

    expect(payload.vat).toBeUndefined();
    expect(payload.iat).toBe(1000);
  });
});
