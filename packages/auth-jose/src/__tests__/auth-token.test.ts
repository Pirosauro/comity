import type { AuthSession } from "@comity/auth";
import { AuthSessionId } from "@comity/auth";
import { isFailure } from "@comity/primitives/result";

import { describe, expect, it, vi } from "vitest";
import { JoseAuthTokenService } from "../auth-token.js";

function makeSessionId(value: string): AuthSessionId {
  const result = AuthSessionId.create(value);

  if (isFailure(result)) {
    throw new Error("Unexpected failure");
  }

  return result.value;
}

const createSession = (overrides: Partial<AuthSession> = {}): AuthSession => {
  const now = Date.now();

  return {
    id: makeSessionId("session-1"),
    createdAt: now,
    verifiedAt: now,
    expiresAt: now + 60 * 60 * 1000,
    assurance: {
      methods: ["password"],
      score: 2,
      evaluatedAt: now,
      version: 1,
    },
    transport: { type: "jwt" },
    refresh: {
      enabled: true,
      expiresAt: now + 2 * 60 * 60 * 1000,
    },
    stepUp: {
      parent: makeSessionId("session-root"),
      at: now + 2000,
    },
    scopes: ["read", "write"],
    ...overrides,
  };
};

const createObserver = () => ({
  onTokenVerified: vi.fn(),
  onTokenInvalid: vi.fn(),
});

describe("JoseAuthTokenService", () => {
  it("signs and verifies access tokens", async () => {
    const key = new TextEncoder().encode("access-secret-32-bytes-length!!");
    const observer = createObserver();
    const service = new JoseAuthTokenService(
      {
        issuer: "issuer",
        audience: "audience",
        accessKey: key,
        refreshKey: key,
        algorithm: "HS256",
      },
      observer
    );
    const session = createSession();
    const signed = await service.signAccessToken(session);

    expect(signed.ok).toBe(true);

    if (!signed.ok) throw signed.error;

    const verified = await service.verifyAccessToken(signed.value);

    expect(verified.ok).toBe(true);

    if (!verified.ok) throw verified.error;

    expect(verified.value.id.equals(session.id)).toBe(true);
    expect(verified.value.assurance.score).toBe(session.assurance.score);
    expect(observer.onTokenVerified).toHaveBeenCalledWith(
      expect.objectContaining({
        kind: "access",
        sessionId: session.id,
        assuranceScore: session.assurance.score,
      })
    );
    expect(observer.onTokenInvalid).not.toHaveBeenCalled();
  });

  it("signs and verifies refresh tokens", async () => {
    const key = new TextEncoder().encode("refresh-secret-32-bytes-length!");
    const observer = createObserver();
    const service = new JoseAuthTokenService(
      {
        issuer: "issuer",
        audience: "audience",
        accessKey: key,
        refreshKey: key,
        algorithm: "HS256",
      },
      observer
    );
    const session = createSession();
    const signed = await service.signRefreshToken(session);

    expect(signed.ok).toBe(true);

    if (!signed.ok) throw signed.error;

    const verified = await service.verifyRefreshToken(signed.value);

    expect(verified.ok).toBe(true);

    if (!verified.ok) throw verified.error;

    expect(verified.value.id.equals(session.id)).toBe(true);
    expect(observer.onTokenVerified).toHaveBeenCalledWith(
      expect.objectContaining({
        kind: "refresh",
        sessionId: session.id,
      })
    );
  });

  it("omits optional fields in verification events when absent", async () => {
    const key = new TextEncoder().encode("optional-fields-32-bytes-len");
    const observer = createObserver();
    const service = new JoseAuthTokenService(
      {
        issuer: "issuer",
        audience: "audience",
        accessKey: key,
        refreshKey: key,
        algorithm: "HS256",
      },
      observer
    );
    const session = createSession({
      expiresAt: undefined,
      scopes: undefined,
      refresh: undefined,
      stepUp: undefined,
    });
    const signed = await service.signAccessToken(session);

    expect(signed.ok).toBe(true);

    if (!signed.ok) throw signed.error;

    const verified = await service.verifyAccessToken(signed.value);

    expect(verified.ok).toBe(true);

    if (!verified.ok) throw verified.error;

    const payload = observer.onTokenVerified.mock.calls[0]?.[0];

    expect(payload).toBeDefined();
    expect("expiresAt" in payload).toBe(false);
    expect("scopes" in payload).toBe(false);
  });

  it("returns failure when refresh is not allowed", async () => {
    const key = new TextEncoder().encode("refresh-disabled-32-bytes-len!");
    const observer = createObserver();
    const service = new JoseAuthTokenService(
      {
        issuer: "issuer",
        audience: "audience",
        accessKey: key,
        refreshKey: key,
        algorithm: "HS256",
      },
      observer
    );
    const session = createSession({ refresh: { enabled: false } });

    const result = await service.signRefreshToken(session);

    expect(result.ok).toBe(false);

    if (result.ok) throw new Error("Expected failure");

    expect(result.error.meta.reason).toBe("refresh_not_allowed");
    expect(observer.onTokenInvalid).toHaveBeenCalledWith(
      expect.objectContaining({
        kind: "refresh",
        reason: "refresh_not_allowed",
      })
    );
  });

  it("returns failure when verification fails", async () => {
    const key = new TextEncoder().encode("verify-failure-32-bytes-len!!");
    const observer = createObserver();
    const service = new JoseAuthTokenService(
      {
        issuer: "issuer",
        audience: "audience",
        accessKey: key,
        refreshKey: key,
        algorithm: "HS256",
      },
      observer
    );

    const result = await service.verifyAccessToken("not-a-token");

    expect(result.ok).toBe(false);

    if (result.ok) throw new Error("Expected failure");

    expect(result.error.meta.reason).toBe("token_invalid");
    expect(observer.onTokenInvalid).toHaveBeenCalledWith(
      expect.objectContaining({
        kind: "access",
        reason: "token_invalid",
      })
    );
  });

  it("returns failure when signing fails", async () => {
    const observer = createObserver();
    const service = new JoseAuthTokenService(
      {
        issuer: "issuer",
        audience: "audience",
        accessKey: {} as never,
        refreshKey: {} as never,
        algorithm: "HS256",
      },
      observer
    );
    const session = createSession();

    const result = await service.signAccessToken(session);

    expect(result.ok).toBe(false);

    if (result.ok) throw new Error("Expected failure");

    expect(result.error.meta.reason).toBe("invalid_credentials");
    expect(observer.onTokenInvalid).toHaveBeenCalledWith(
      expect.objectContaining({
        kind: "access",
        reason: "invalid_credentials",
      })
    );
  });
});
