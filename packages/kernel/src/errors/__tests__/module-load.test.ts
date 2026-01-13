import { describe, expect, it } from "vitest";
import { ModuleLoadError } from "../module-load.js";

describe("ModuleLoadError", () => {
  it("should create error with meta", () => {
    const error = new ModuleLoadError({
      reason: "setup_failed",
      module: "test-module",
    });

    expect(error.message).toBe("Module load error");
    expect(error.code).toBe("kernel:module_load");
    expect(error.name).toBe("ModuleLoadError");
    expect(error.meta.httpStatus).toBe(500);
    expect(error.meta.reason).toBe("setup_failed");
    expect(error.meta.module).toBe("test-module");
  });

  it("should include cause in error", () => {
    const cause = new Error("Setup failed");
    const error = new ModuleLoadError({
      reason: "apply_failed",
      module: "auth",
      cause,
    });

    expect(error.cause).toBe(cause);
    expect(error.meta.httpStatus).toBe(500);
  });

  it("should be instanceof Error", () => {
    const error = new ModuleLoadError({
      reason: "resolution_failed",
    });

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(ModuleLoadError);
  });

  it("should have correct stack trace", () => {
    const error = new ModuleLoadError({
      reason: "setup_failed",
    });

    expect(error.stack).toBeDefined();
    expect(error.stack).toContain("ModuleLoadError");
  });
});
