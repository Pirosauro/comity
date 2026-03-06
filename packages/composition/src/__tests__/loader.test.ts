import type { ResultFailure } from "@comity/primitives/result";

import { BaseError } from "@comity/primitives/error";
import { failure, success } from "@comity/primitives/result";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { CompositionError } from "../error/composition.js";
import { load } from "../loader.js";

class TestError extends BaseError {
  readonly code = "mock:error";

  constructor(meta: Record<string, unknown>) {
    super("Test error occurred", meta);
  }
}

describe("load", () => {
  let mockKernel: any;

  beforeEach(() => {
    mockKernel = {
      createModuleSetupContext: vi.fn(() => ({})),
      seal: vi.fn(),
    };
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
  });

  it("should handle module resolution failure", async () => {
    // Mock resolveModuleOrder to return failure
    const mockResolver = vi.fn(() =>
      failure(new CompositionError("cycle_detected", { cycle: ["moduleA"] }))
    );

    vi.doMock("../resolver.js", () => ({ resolveModuleOrder: mockResolver }));

    const modules = [
      {
        name: "moduleA",
        version: "1.0.0",
        setup: vi.fn(async () => success(async () => success(undefined))),
        dependsOn: { moduleA: {} }, // cycle
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
    expect(result.error.meta.module).toBe("moduleA");
  });

  it("should handle apply failure", async () => {
    const modules = [
      {
        name: "moduleA",
        version: "1.0.0",
        setup: vi.fn(async () =>
          success(async () =>
            failure(
              new TestError({
                reason: "apply failed",
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
    expect(result.error.meta.reason).toBe("apply_failed");
    expect(result.error.meta.module).toBe("moduleA");
  });

  it("should pass options to setup", async () => {
    const setupFn = vi.fn(async (options) => {
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

    expect(setupFn).toHaveBeenCalledWith({ key: "value" });
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
    // Assuming resolver orders them correctly
  });

  it("should pass undefined options when not provided", async () => {
    const setupFn = vi.fn(async (options) => {
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

    expect(setupFn).toHaveBeenCalledWith(undefined);
  });

  it("should handle empty module array", async () => {
    const result = await load(mockKernel, []);

    expect(result.success).toBe(true);
    expect(mockKernel.seal).toHaveBeenCalled();
  });
});
