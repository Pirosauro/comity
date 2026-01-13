import { failure, success } from "@comity/core/result";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ModuleLoadError } from "../../errors/module-load.js";
import { ModuleResolutionError } from "../../errors/module-resolution.js";
import { loadModules } from "../loader.js";

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

    const result = await loadModules(mockKernel, modules as any[]);

    expect(result.success).toBe(true);
    expect(mockKernel.seal).toHaveBeenCalled();
  });

  it("should handle module resolution failure", async () => {
    // Mock resolveModuleOrder to return failure
    const mockResolver = vi.fn(() =>
      failure(new ModuleResolutionError({ reason: "cycle_detected" })),
    );
    vi.doMock("../resolver.js", () => ({ resolveModuleOrder: mockResolver }));

    const modules = [
      {
        name: "moduleA",
        dependsOn: ["moduleA"], // cycle
      },
    ];

    const result = await loadModules(mockKernel, modules as any[]);

    expect(result.success).toBe(false);
    expect((result as any).error).toBeInstanceOf(ModuleLoadError);
    expect((result as any).error.meta.reason).toBe("resolution_failed");
  });

  it("should handle setup function failure", async () => {
    const modules = [
      {
        name: "moduleA",
        setup: vi.fn(async () => failure(new Error("Setup failed"))),
      },
    ];

    const result = await loadModules(mockKernel, modules as any[]);

    expect(result.success).toBe(false);
    expect((result as any).error).toBeInstanceOf(ModuleLoadError);
    expect((result as any).error.meta.reason).toBe("setup_failed");
    expect((result as any).error.meta.module).toBe("moduleA");
  });

  it("should handle apply failure", async () => {
    const modules = [
      {
        name: "moduleA",
        setup: vi.fn(async () =>
          success(async () => failure(new Error("Apply failed"))),
        ),
      },
    ];

    const result = await loadModules(mockKernel, modules as any[]);

    expect(result.success).toBe(false);
    expect((result as any).error).toBeInstanceOf(ModuleLoadError);
    expect((result as any).error.meta.reason).toBe("apply_failed");
    expect((result as any).error.meta.module).toBe("moduleA");
  });

  it("should pass options to setup", async () => {
    const setupFn = vi.fn(async (options) => {
      expect(options).toEqual({ key: "value" });
      return success(async () => success(undefined));
    });

    const modules = [
      {
        name: "moduleA",
        setup: setupFn,
      },
    ];

    const options = { moduleA: { key: "value" } };

    await loadModules(mockKernel, modules as any[], options);

    expect(setupFn).toHaveBeenCalledWith({ key: "value" });
  });

  it("should load multiple modules in order", async () => {
    const modules = [
      {
        name: "moduleA",
        dependsOn: ["moduleB"],
        setup: vi.fn(async () => success(async () => success(undefined))),
      },
      {
        name: "moduleB",
        setup: vi.fn(async () => success(async () => success(undefined))),
      },
    ];

    const result = await loadModules(mockKernel, modules as any[]);

    expect(result.success).toBe(true);
    // Assuming resolver orders them correctly
  });
});
