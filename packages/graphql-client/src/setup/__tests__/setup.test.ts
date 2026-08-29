import type { ModuleSetupContext } from "@comity/composition/setup";

import { beforeEach, describe, expect, it, vi } from "vitest";
import { DefaultHookBus } from "@comity/primitives/lifecycle";
import { isSuccess } from "@comity/primitives/result";
import { CompositionError } from "@comity/composition/errors";
import { GraphqlClient } from "../../client.js";
import { GRAPHQL_CLIENT_TOKEN } from "../constants.js";
import module from "../index.js";

function createClient(): GraphqlClient {
  return new GraphqlClient({
    transport: {
      execute: vi.fn().mockResolvedValue({ data: null }),
    },
  });
}

describe("graphql-client module setup", () => {
  let define: ReturnType<typeof vi.fn>;
  let resolve: ReturnType<typeof vi.fn>;
  let ctx: ModuleSetupContext;

  beforeEach(() => {
    define = vi.fn();
    resolve = vi.fn();

    ctx = {
      services: { define, resolve },
      events: {},
      hooks: new DefaultHookBus<any>(),
    } as unknown as ModuleSetupContext;
  });

  it("should fail when no transport is configured", async () => {
    const result = await module.setup(ctx, {});

    expect(result.success).toBe(true);
    if (isSuccess(result)) {
      const init = await result.value();

      expect(init.success).toBe(false);
      if (!init.success) {
        expect(init.error).toBeInstanceOf(CompositionError);
        expect(init.error.meta?.reason).toBe("initialization_failed");
        expect(init.error.meta?.details?.module).toBe("@comity/graphql-client");
        expect(init.error.meta?.details?.violation).toBe("missing_transport");
      }
    }
  });

  it("should succeed and define the graphql registry service", async () => {
    const client = createClient();
    const result = await module.setup(ctx, { catalog: client });

    expect(result.success).toBe(true);
    if (isSuccess(result)) {
      const init = await result.value();

      expect(init.success).toBe(true);
      expect(define).toHaveBeenCalledWith(GRAPHQL_CLIENT_TOKEN, expect.any(Function));
    }
  });

  it("should return a registry exposing the configured clients", async () => {
    const client = createClient();
    const result = await module.setup(ctx, { catalog: client });

    if (isSuccess(result)) {
      await result.value();

      const factory = define.mock.calls.find((c) => c[0] === GRAPHQL_CLIENT_TOKEN)?.[1];
      const registry = factory?.();

      expect(registry.has("catalog")).toBe(true);
      expect(registry.get("catalog")).toBe(client);
      expect(registry.has("unknown")).toBe(false);
    }
  });

  it("should let the configuring hook inject clients", async () => {
    const client = createClient();
    const hooks = new DefaultHookBus<any>();

    hooks.define("@comity/graphql-client:configuring", () => ({ catalog: client }));

    const configuredCtx = {
      services: { define, resolve },
      events: {},
      hooks,
    } as unknown as ModuleSetupContext;

    const result = await module.setup(configuredCtx, {});

    expect(result.success).toBe(true);
    if (isSuccess(result)) {
      await result.value();

      expect(define).toHaveBeenCalledWith(GRAPHQL_CLIENT_TOKEN, expect.any(Function));
    }
  });

  it("should execute the initialized hook during init", async () => {
    const client = createClient();
    const initialized = vi.fn();
    const hooks = new DefaultHookBus<any>();

    hooks.define("@comity/graphql-client:initialized", initialized);

    const hooksCtx = {
      services: { define, resolve },
      events: {},
      hooks,
    } as unknown as ModuleSetupContext;

    const result = await module.setup(hooksCtx, { catalog: client });

    if (isSuccess(result)) {
      await result.value();

      expect(initialized).toHaveBeenCalled();
    }
  });
});