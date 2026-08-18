import type { AuthSessionAssuranceEvaluator } from "../../contracts/session-assurance-evaluator.js";
import type { ModuleSetupContext } from "@comity/composition/setup";
import type { AuthModuleOptions } from "../types.js";

import { beforeEach, describe, expect, it, vi } from "vitest";
import { DefaultHookBus } from "@comity/primitives/lifecycle";
import { isSuccess } from "@comity/primitives/result";
import { CompositionError } from "@comity/composition/errors";
import { AuthSessionId } from "../../value-objects/auth-session-id.js";
import { MemoryAuthSessionRepository } from "../../repositories/memory.js";
import { AUTH_TOKEN } from "../constants.js";
import { module } from "../index.js";

function createEvaluator(): AuthSessionAssuranceEvaluator {
  return {
    evaluate: (_input, now) => ({
      methods: ["password"],
      score: 1,
      evaluatedAt: now,
      version: 1,
    }),
  };
}

function createOptions(): AuthModuleOptions {
  return {
    repository: new MemoryAuthSessionRepository(),
    evaluator: createEvaluator(),
  };
}

describe("auth module setup", () => {
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

  it("should fail when no repository is configured", async () => {
    const result = await module.setup(ctx, { evaluator: createEvaluator() });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBeInstanceOf(CompositionError);
      expect(result.error.meta?.reason).toBe("setup_failed");
      expect(result.error.meta?.details?.module).toBe("@comity/auth");
      expect(result.error.meta?.details?.violation).toBe("missing_repository");
    }
  });

  it("should fail when no evaluator is configured", async () => {
    const result = await module.setup(ctx, { repository: new MemoryAuthSessionRepository() });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.meta?.details?.violation).toBe("missing_evaluator");
    }
  });

  it("should succeed and define the auth facade service", async () => {
    const result = await module.setup(ctx, createOptions());

    expect(result.success).toBe(true);
    if (isSuccess(result)) {
      const init = await result.value();

      expect(init.success).toBe(true);
      expect(define).toHaveBeenCalledWith(AUTH_TOKEN, expect.any(Function));
    }
  });

  it("should let the configuring hook inject repository and evaluator", async () => {
    const options = createOptions();
    const hooks = new DefaultHookBus<any>();

    hooks.define("@comity/auth:configuring", () => options);

    const configuredCtx = {
      services: { define, resolve },
      events: { emit },
      hooks,
    } as unknown as ModuleSetupContext;

    const result = await module.setup(configuredCtx, {});

    expect(result.success).toBe(true);
    if (isSuccess(result)) {
      await result.value();

      expect(define).toHaveBeenCalledWith(AUTH_TOKEN, expect.any(Function));
    }
  });

  it("should execute the initialized hook during init", async () => {
    const initialized = vi.fn();
    const hooks = new DefaultHookBus<any>();

    hooks.define("@comity/auth:initialized", initialized);

    const hooksCtx = {
      services: { define, resolve },
      events: { emit },
      hooks,
    } as unknown as ModuleSetupContext;

    const result = await module.setup(hooksCtx, createOptions());

    if (isSuccess(result)) {
      await result.value();

      expect(initialized).toHaveBeenCalled();
    }
  });

  it("should return a working auth facade that creates sessions", async () => {
    const repository = new MemoryAuthSessionRepository();
    const result = await module.setup(ctx, { ...createOptions(), repository });

    if (isSuccess(result)) {
      await result.value();

      const factory = define.mock.calls.find((c) => c[0] === AUTH_TOKEN)?.[1];
      const auth = factory?.();

      const created = await auth.createSession(
        {
          id: new AuthSessionId("session-1"),
          methods: ["password"],
          version: 1,
          transport: { type: "bearer" },
        },
        1000
      );

      expect(created.ok).toBe(true);

      const stored = await repository.getById(new AuthSessionId("session-1"));
      expect(stored.success).toBe(true);
      if (stored.success) {
        expect(stored.value).not.toBeNull();
      }
    }
  });

  it("should emit session_created when creating a session", async () => {
    const result = await module.setup(ctx, createOptions());

    if (isSuccess(result)) {
      await result.value();

      const factory = define.mock.calls.find((c) => c[0] === AUTH_TOKEN)?.[1];
      const auth = factory?.();

      await auth.createSession(
        {
          id: new AuthSessionId("session-1"),
          methods: ["password"],
          version: 1,
          transport: { type: "bearer" },
        },
        1000
      );

      expect(emit).toHaveBeenCalledWith(
        "@comity/auth:session_created",
        expect.objectContaining({ sessionId: expect.any(AuthSessionId) })
      );
    }
  });
});