import { describe, expect, it } from "vitest";
import { ModuleResolutionError } from "../module-resolution.js";

describe("ModuleResolutionError", () => {
  it("should create error with default httpStatus", () => {
    const error = new ModuleResolutionError({
      reason: "cycle_detected",
      module: "test-module",
    });

    expect(error.message).toBe("Module resolution failed");
    expect(error.code).toBe("kernel:module_resolution_failed");
    expect(error.name).toBe("ModuleResolutionError");
    expect(error.meta.httpStatus).toBe(500);
    expect(error.meta.reason).toBe("cycle_detected");
    expect(error.meta.module).toBe("test-module");
  });

  it("should allow custom httpStatus", () => {
    const error = new ModuleResolutionError({
      reason: "missing_dependency",
      module: "auth",
      dependency: "db",
      httpStatus: 400,
    });

    expect(error.meta.httpStatus).toBe(400);
    expect(error.meta.dependency).toBe("db");
  });

  it("should include cycle information", () => {
    const error = new ModuleResolutionError({
      reason: "cycle_detected",
      cycle: ["moduleA", "moduleB", "moduleA"],
    });

    expect(error.meta.cycle).toEqual(["moduleA", "moduleB", "moduleA"]);
  });

  it("should be instanceof Error", () => {
    const error = new ModuleResolutionError({
      reason: "missing_dependency",
    });

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(ModuleResolutionError);
  });

  it("should have correct stack trace", () => {
    const error = new ModuleResolutionError({
      reason: "missing_dependency",
    });

    expect(error.stack).toBeDefined();
    expect(error.stack).toContain("ModuleResolutionError");
  });
});
