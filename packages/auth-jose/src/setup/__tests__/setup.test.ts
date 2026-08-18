import type { AuthSession } from "@comity/auth";
import type { AuthFacade } from "@comity/auth";
import type { ModuleSetupContext } from "@comity/composition/setup";

import { beforeEach, describe, expect, it, vi } from "vitest";
import { DefaultHookBus } from "@comity/primitives/lifecycle";
import { isSuccess } from "@comity/primitives/result";
import { CompositionError } from "@comity/composition/errors";
import { AuthSessionId } from "@comity/auth";
import { AUTH_TOKEN } from "@comity/auth/setup";
import { AUTH_JOSE_TOKEN } from "../constants.js";
import { module } from "../index.js";

const accessKey = new TextEncoder().encode("access-secret-32-bytes-length!!");
const refreshKey = new TextEncoder().encode("refresh-secret-32-bytes-length!");

function createSession(): AuthSession {
  return {
    id: new AuthSessionId("session-1"),
    createdAt: 1000,
    verifiedAt: 1000,
    assurance: {
      methods: ["password"],
      score: 1,
      evaluatedAt: 1000,
      version: 1,
    },
    transport: { type: "bearer" },
    refresh: { enabled: true },
  };
}

describe("auth-jose module setup", () => {
  let define: ReturnType<typeof vi.fn>;
  let resolve: ReturnType<typeof vi.fn>;
  let emit: ReturnType<typeof vi.fn>;
  let ctx: ModuleSetupContext;

  beforeEach(() => {
    define = vi.fn();
    resolve = vi.fn();
    emit = vi.fn();

    ctx = {
      services: { define, resolve },
      events: { emit },
      hooks: new DefaultHookBus<any>(),
    } as unknown as ModuleSetupContext;
  });

  it("should fail when no issuer is configured", async () => {
    const result = await module.setup(ctx, {
      audience: "audience",
      accessKey,
      refreshKey,
      algorithm: "HS256",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBeInstanceOf(CompositionError);
      expect(result.error.meta?.reason).toBe("setup_failed");
      expect(result.error.meta?.details?.module).toBe("@comity/auth-jose");
      expect(result.error.meta?.details?.violation).toBe("missing_issuer");
    }
  });

  it("should fail when no access key is configured", async () => {
    const result = await module.setup(ctx, {
      issuer: "issuer",
      audience: "audience",
      refreshKey,
      algorithm: "HS256",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.meta?.details?.violation).toBe("missing_access_key");
    }
  });

  it("should fail when no refresh key is configured", async () => {
    const result = await module.setup(ctx, {
      issuer: "issuer",
      audience: "audience",
      accessKey,
      algorithm: "HS256",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.meta?.details?.violation).toBe("missing_refresh_key");
    }
  });

  it("should succeed and resolve the auth facade", async () => {
    const auth = { createSession: vi.fn() } as unknown as AuthFacade;
    resolve.mockReturnValue(auth);

    const result = await module.setup(ctx, {
      issuer: "issuer",
      audience: "audience",
      accessKey,
      refreshKey,
      algorithm: "HS256",
    });

    expect(result.success).toBe(true);
    if (isSuccess(result)) {
      const init = await result.value();

      expect(init.success).toBe(true);
      expect(resolve).toHaveBeenCalledWith(AUTH_TOKEN);
      expect(define).toHaveBeenCalledWith(AUTH_JOSE_TOKEN, expect.any(Function));
    }
  });

  it("should return a working token facade from the service factory", async () => {
    const auth: AuthFacade = {
      createSession: vi.fn().mockResolvedValue({ ok: true, value: createSession() }),
      assertSession: vi.fn(),
      refreshSession: vi.fn(),
      revokeSession: vi.fn(),
      stepUpSession: vi.fn(),
    } as unknown as AuthFacade;
    resolve.mockReturnValue(auth);

    const result = await module.setup(ctx, {
      issuer: "issuer",
      audience: "audience",
      accessKey,
      refreshKey,
      algorithm: "HS256",
    });

    if (isSuccess(result)) {
      await result.value();

      const factory = define.mock.calls.find((c) => c[0] === AUTH_JOSE_TOKEN)?.[1];
      const tokenFacade = factory?.();

      const envelope = await tokenFacade.issueTokens(
        {
          id: new AuthSessionId("session-1"),
          methods: ["password"],
          version: 1,
          transport: { type: "bearer" },
          refresh: 2000,
        },
        1000
      );

      expect(envelope.ok).toBe(true);
      if (envelope.ok) {
        expect(envelope.value.accessToken).toEqual(expect.any(String));
        expect(envelope.value.refreshToken).toEqual(expect.any(String));
      }

      expect(auth.createSession).toHaveBeenCalled();
    }
  });

  it("should let the configuring hook inject missing keys", async () => {
    const auth = { createSession: vi.fn() } as unknown as AuthFacade;
    resolve.mockReturnValue(auth);
    const hooks = new DefaultHookBus<any>();

    hooks.define("@comity/auth-jose:configuring", () => ({
      issuer: "issuer",
      audience: "audience",
      accessKey,
      refreshKey,
      algorithm: "HS256",
    }));

    const configuredCtx = {
      services: { define, resolve },
      events: { emit },
      hooks,
    } as unknown as ModuleSetupContext;

    const result = await module.setup(configuredCtx, {});

    expect(result.success).toBe(true);
    if (isSuccess(result)) {
      await result.value();

      expect(define).toHaveBeenCalledWith(AUTH_JOSE_TOKEN, expect.any(Function));
    }
  });

  it("should execute the initialized hook during init", async () => {
    const auth = { createSession: vi.fn() } as unknown as AuthFacade;
    resolve.mockReturnValue(auth);
    const initialized = vi.fn();
    const hooks = new DefaultHookBus<any>();

    hooks.define("@comity/auth-jose:initialized", initialized);

    const hooksCtx = {
      services: { define, resolve },
      events: { emit },
      hooks,
    } as unknown as ModuleSetupContext;

    const result = await module.setup(hooksCtx, {
      issuer: "issuer",
      audience: "audience",
      accessKey,
      refreshKey,
      algorithm: "HS256",
    });

    if (isSuccess(result)) {
      await result.value();

      expect(initialized).toHaveBeenCalled();
    }
  });
});