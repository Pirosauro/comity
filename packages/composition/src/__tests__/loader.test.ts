import type { ResultFailure } from "@comity/primitives/result";

import { BaseError } from "@comity/primitives/errors";
import { failure, success } from "@comity/primitives/result";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { CompositionError } from "../errors/composition.js";
import { load } from "../loader.js";

class TestError extends BaseError {
  readonly code = "mock:error";

  constructor(meta: Record<string, unknown>) {
    super("Test error occurred", meta);
  }
}

function createMockKernel() {
  return {
    services: { define: vi.fn(), resolve: vi.fn(), clear: vi.fn() },
    events: { subscribe: vi.fn(), unsubscribe: vi.fn(), emit: vi.fn() },
    hooks: { define: vi.fn(), execute: vi.fn() },
    seal: vi.fn(() => success("sealed")),
    start: vi.fn(() => success("running")),
  };
}

describe("load", () => {
  let mockKernel: ReturnType<typeof createMockKernel>;

  beforeEach(() => {
    mockKernel = createMockKernel();
  });

  it("should load modules successfully", async () => {
    const modules = [
      {
        name: "moduleA",
        version: "1.0.0",
        setup: vi.fn(async () => success(async () => success(undefined))),
      },
    ];

    const result = await load(mockKernel, modules);

    expect(result.success).toBe(true);
    expect(mockKernel.seal).toHaveBeenCalled();
    expect(mockKernel.start).toHaveBeenCalled();
  });

  it("should handle module resolution failure", async () => {
    const modules = [
      {
        name: "moduleA",
        version: "1.0.0",
        setup: vi.fn(async () => success(async () => success(undefined))),
        dependsOn: { moduleA: {} }, // self-cycle -> resolution failure
      },
    ];

    const result = (await load(mockKernel, modules)) as ResultFailure;

    expect(result.success).toBe(false);
    expect(result.error).toBeInstanceOf(CompositionError);
    expect(result.error.meta.reason).toBe("resolution_failed");
  });

  it("should handle setup function failure", async () => {
    const modules = [
      {
        name: "moduleA",
        version: "1.0.0",
        setup: vi.fn(async () => failure(new Error("Setup failed") as any)),
      },
    ];

    const result = (await load(mockKernel, modules)) as ResultFailure;

    expect(result.success).toBe(false);
    expect(result.error).toBeInstanceOf(CompositionError);
    expect(result.error.meta.reason).toBe("setup_failed");
    expect(result.error.meta.details?.module).toBe("moduleA");
  });

  it("should handle initialization failure", async () => {
    const modules = [
      {
        name: "moduleA",
        version: "1.0.0",
        setup: vi.fn(async () =>
          success(async () =>
            failure(
              new TestError({
                reason: "initialization_failed",
                module: "moduleA",
              })
            )
          )
        ),
      },
    ];

    const result = (await load(mockKernel, modules)) as ResultFailure;

    expect(result.success).toBe(false);
    expect(result.error).toBeInstanceOf(CompositionError);
    expect(result.error.meta.reason).toBe("initialization_failed");
    expect(result.error.meta.details?.module).toBe("moduleA");
  });

  it("should pass options to setup", async () => {
    const setupFn = vi.fn(async (_ctx: any, options: any) => {
      expect(options).toEqual({ key: "value" });

      return success(async () => success(undefined));
    });

    const modules = [
      {
        name: "moduleA",
        version: "1.0.0",
        setup: setupFn,
      },
    ];

    const options = { moduleA: { key: "value" } };

    await load(mockKernel, modules, options);

    expect(setupFn).toHaveBeenCalledWith(
      {
        services: mockKernel.services,
        events: mockKernel.events,
        hooks: mockKernel.hooks,
      },
      { key: "value" }
    );
  });

  it("should load multiple modules in order", async () => {
    const modules = [
      {
        name: "moduleA",
        version: "1.0.0",
        dependsOn: { moduleB: {} },
        setup: vi.fn(async () => success(async () => success(undefined))),
      },
      {
        name: "moduleB",
        version: "1.0.0",
        setup: vi.fn(async () => success(async () => success(undefined))),
      },
    ];

    const result = await load(mockKernel, modules);

    expect(result.success).toBe(true);
  });

  it("should pass undefined options when not provided", async () => {
    const setupFn = vi.fn(async (_ctx: any, options: any) => {
      expect(options).toBeUndefined();

      return success(async () => success(undefined));
    });

    const modules = [
      {
        name: "moduleA",
        version: "1.0.0",
        setup: setupFn,
      },
    ];

    await load(mockKernel, modules);

    expect(setupFn).toHaveBeenCalledWith(
      {
        services: mockKernel.services,
        events: mockKernel.events,
        hooks: mockKernel.hooks,
      },
      undefined
    );
  });

  it("should handle empty module array", async () => {
    const result = await load(mockKernel, []);

    expect(result.success).toBe(true);
    expect(mockKernel.seal).toHaveBeenCalled();
    expect(mockKernel.start).toHaveBeenCalled();
  });

  it("should seal the kernel before running initializers", async () => {
    const order: string[] = [];
    const initFn = vi.fn(async () => {
      order.push("init");

      return success(undefined);
    });

    mockKernel.seal.mockImplementation(() => {
      order.push("seal");

      return success("sealed");
    });

    const modules = [
      {
        name: "moduleA",
        version: "1.0.0",
        setup: vi.fn(async () => success(initFn)),
      },
    ];

    await load(mockKernel, modules);

    expect(order).toEqual(["seal", "init"]);
  });

  it("should propagate a seal failure", async () => {
    mockKernel.seal.mockReturnValue(failure(new Error("Seal failed") as any));

    const modules = [
      {
        name: "moduleA",
        version: "1.0.0",
        setup: vi.fn(async () => success(async () => success(undefined))),
      },
    ];

    const result = (await load(mockKernel, modules)) as ResultFailure;

    expect(result.success).toBe(false);
    expect(result.error).toBeInstanceOf(CompositionError);
    expect(result.error.meta.reason).toBe("initialization_failed");
  });

  it("should not run initializers when sealing fails", async () => {
    const initFn = vi.fn(async () => success(undefined));

    mockKernel.seal.mockReturnValue(failure(new Error("Seal failed") as any));

    const modules = [
      {
        name: "moduleA",
        version: "1.0.0",
        setup: vi.fn(async () => success(initFn)),
      },
    ];

    await load(mockKernel, modules);

    expect(initFn).not.toHaveBeenCalled();
    expect(mockKernel.start).not.toHaveBeenCalled();
  });

  it("should propagate a start failure", async () => {
    mockKernel.start.mockReturnValue(failure(new Error("Start failed") as any));

    const modules = [
      {
        name: "moduleA",
        version: "1.0.0",
        setup: vi.fn(async () => success(async () => success(undefined))),
      },
    ];

    const result = (await load(mockKernel, modules)) as ResultFailure;

    expect(result.success).toBe(false);
    expect(result.error).toBeInstanceOf(CompositionError);
    expect(result.error.meta.reason).toBe("initialization_failed");
  });

  it("should start the kernel after initialization", async () => {
    const order: string[] = [];
    const initFn = vi.fn(async () => {
      order.push("init");

      return success(undefined);
    });

    mockKernel.start.mockImplementation(() => {
      order.push("start");

      return success("running");
    });

    const modules = [
      {
        name: "moduleA",
        version: "1.0.0",
        setup: vi.fn(async () => success(initFn)),
      },
    ];

    await load(mockKernel, modules);

    expect(order).toEqual(["init", "start"]);
  });
});