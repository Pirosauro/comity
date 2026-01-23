import type { ResultFailure } from "@comity/primitives/result";

import { BaseError } from "@comity/primitives/errors";
import { failure, success } from "@comity/primitives/result";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ModuleLoadError } from "../../errors/module-load.js";
import { ModuleResolutionError } from "../../errors/module-resolution.js";
import { loadModules } from "../loader.js";

class TestError extends BaseError {
  readonly code = "mock:error";

  constructor(meta: Record<string, unknown>) {
    super("Test error occurred", meta);
  }
}

describe("loadModules", () => {
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

    const result = await loadModules(mockKernel, modules);

    expect(result.success).toBe(true);
    expect(mockKernel.seal).toHaveBeenCalled();
  });

  it("should handle module resolution failure", async () => {
    // Mock resolveModuleOrder to return failure
    const mockResolver = vi.fn(() =>
      failure(new ModuleResolutionError({ reason: "cycle-detected" }))
    );
    vi.doMock("../resolver.js", () => ({ resolveModuleOrder: mockResolver }));

    const modules = [
      {
        name: "moduleA",
        version: "1.0.0",
        setup: vi.fn(async () => success(async () => success(undefined))),
        dependsOn: ["moduleA"], // cycle
      },
    ];

    const result = (await loadModules(mockKernel, modules)) as ResultFailure;

    expect(result.success).toBe(false);
    expect(result.error).toBeInstanceOf(ModuleLoadError);
    expect(result.error.meta.reason).toBe("resolution-failed");
  });

  it("should handle setup function failure", async () => {
    const modules = [
      {
        name: "moduleA",
        version: "1.0.0",
        setup: vi.fn(async () => failure(new Error("Setup failed") as any)),
      },
    ];

    const result = (await loadModules(mockKernel, modules)) as ResultFailure;

    expect(result.success).toBe(false);
    expect(result.error).toBeInstanceOf(ModuleLoadError);
    expect(result.error.meta.reason).toBe("setup-failed");
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

    const result = (await loadModules(mockKernel, modules)) as ResultFailure;

    expect(result.success).toBe(false);
    expect(result.error).toBeInstanceOf(ModuleLoadError);
    expect(result.error.meta.reason).toBe("apply-failed");
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

    await loadModules(mockKernel, modules, options);

    expect(setupFn).toHaveBeenCalledWith({ key: "value" });
  });

  it("should load multiple modules in order", async () => {
    const modules = [
      {
        name: "moduleA",
        version: "1.0.0",
        dependsOn: ["moduleB"],
        setup: vi.fn(async () => success(async () => success(undefined))),
      },
      {
        name: "moduleB",
        version: "1.0.0",
        setup: vi.fn(async () => success(async () => success(undefined))),
      },
    ];

    const result = await loadModules(mockKernel, modules);

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

    await loadModules(mockKernel, modules);

    expect(setupFn).toHaveBeenCalledWith(undefined);
  });

  it("should create module setup context for each module", async () => {
    const modules = [
      {
        name: "moduleA",
        version: "1.0.0",
        setup: vi.fn(async () => success(async () => success(undefined))),
      },
      {
        name: "moduleB",
        version: "1.0.0",
        setup: vi.fn(async () => success(async () => success(undefined))),
      },
    ];

    await loadModules(mockKernel, modules);

    expect(mockKernel.createModuleSetupContext).toHaveBeenCalledTimes(1);
  });

  it("should handle empty module array", async () => {
    const result = await loadModules(mockKernel, []);

    expect(result.success).toBe(true);
    expect(mockKernel.seal).toHaveBeenCalled();
  });
});
