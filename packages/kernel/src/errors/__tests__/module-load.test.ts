import { describe, expect, it } from "vitest";
import { ModuleLoadError } from "../module-load.js";

describe("ModuleLoadError", () => {
  it("should create error with meta", () => {
    const error = new ModuleLoadError({
      reason: "setup-failed",
      module: "test-module",
    });

    expect(error.message).toBe("Module load error");
    expect(error.code).toBe("kernel:module-load");
    expect(error.name).toBe("ModuleLoadError");
    expect(error.meta.httpStatus).toBe(500);
    expect(error.meta.reason).toBe("setup-failed");
    expect(error.meta.module).toBe("test-module");
  });

  it("should include cause in error", () => {
    const cause = new Error("Setup failed");
    const error = new ModuleLoadError({
      reason: "apply-failed",
      module: "auth",
      cause,
    });

    expect(error.cause).toBe(cause);
    expect(error.meta.httpStatus).toBe(500);
  });

  it("should be instanceof Error", () => {
    const error = new ModuleLoadError({
      reason: "resolution-failed",
    });

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(ModuleLoadError);
  });

  it("should have correct stack trace", () => {
    const error = new ModuleLoadError({
      reason: "setup-failed",
    });

    expect(error.stack).toBeDefined();
    expect(error.stack).toContain("ModuleLoadError");
  });

  it("should handle resolution-failed reason", () => {
    const error = new ModuleLoadError({
      reason: "resolution-failed",
    });

    expect(error.meta.reason).toBe("resolution-failed");
    expect(error.meta.module).toBeUndefined();
  });

  it("should handle setup-failed with module name", () => {
    const error = new ModuleLoadError({
      reason: "setup-failed",
      module: "auth-module",
    });

    expect(error.meta.reason).toBe("setup-failed");
    expect(error.meta.module).toBe("auth-module");
  });

  it("should handle apply-failed with cause", () => {
    const cause = new Error("Application error");
    const error = new ModuleLoadError({
      reason: "apply-failed",
      module: "database-module",
      cause,
    });

    expect(error.meta.reason).toBe("apply-failed");
    expect(error.meta.module).toBe("database-module");
    expect(error.cause).toBe(cause);
  });

  it("should preserve all metadata properties", () => {
    const cause = new Error("Test cause");
    const error = new ModuleLoadError({
      reason: "apply-failed",
      module: "test",
      cause,
    });

    expect(error.meta).toHaveProperty("reason");
    expect(error.meta).toHaveProperty("module");
    expect(error.meta).toHaveProperty("httpStatus");
    expect(error.cause).toBe(cause);
  });
});
