import { describe, expect, it } from "vitest";
import { ModuleResolutionError } from "../module-resolution.js";

describe("ModuleResolutionError", () => {
  it("should create error with default httpStatus", () => {
    const error = new ModuleResolutionError({
      reason: "cycle-detected",
      module: "test-module",
    });

    expect(error.message).toBe("Module resolution failed");
    expect(error.code).toBe("kernel:module-resolution-failed");
    expect(error.name).toBe("ModuleResolutionError");
    expect(error.meta.httpStatus).toBe(500);
    expect(error.meta.reason).toBe("cycle-detected");
    expect(error.meta.module).toBe("test-module");
  });

  it("should allow custom httpStatus", () => {
    const error = new ModuleResolutionError({
      reason: "missing-dependency",
      module: "auth",
      dependency: "db",
      httpStatus: 400,
    });

    expect(error.meta.httpStatus).toBe(400);
    expect(error.meta.dependency).toBe("db");
  });

  it("should include cycle information", () => {
    const error = new ModuleResolutionError({
      reason: "cycle-detected",
      cycle: ["moduleA", "moduleB", "moduleA"],
    });

    expect(error.meta.cycle).toEqual(["moduleA", "moduleB", "moduleA"]);
  });

  it("should be instanceof Error", () => {
    const error = new ModuleResolutionError({
      reason: "missing-dependency",
    });

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(ModuleResolutionError);
  });

  it("should have correct stack trace", () => {
    const error = new ModuleResolutionError({
      reason: "missing-dependency",
    });

    expect(error.stack).toBeDefined();
    expect(error.stack).toContain("ModuleResolutionError");
  });

  it("should handle missing-dependency reason", () => {
    const error = new ModuleResolutionError({
      reason: "missing-dependency",
      module: "app",
      dependency: "logger",
    });

    expect(error.meta.reason).toBe("missing-dependency");
    expect(error.meta.module).toBe("app");
    expect(error.meta.dependency).toBe("logger");
  });

  it("should handle cycle-detected with full cycle path", () => {
    const cycle = ["moduleA", "moduleB", "moduleC", "moduleA"];
    const error = new ModuleResolutionError({
      reason: "cycle-detected",
      module: "moduleA",
      cycle,
    });

    expect(error.meta.cycle).toEqual(cycle);
    expect(error.meta.module).toBe("moduleA");
  });

  it("should default httpStatus to 500 when not provided", () => {
    const error = new ModuleResolutionError({
      reason: "cycle-detected",
    });

    expect(error.meta.httpStatus).toBe(500);
  });

  it("should preserve all metadata properties", () => {
    const error = new ModuleResolutionError({
      reason: "missing-dependency",
      module: "test",
      dependency: "dep",
      httpStatus: 404,
    });

    expect(error.meta).toHaveProperty("reason");
    expect(error.meta).toHaveProperty("module");
    expect(error.meta).toHaveProperty("dependency");
    expect(error.meta).toHaveProperty("httpStatus");
  });

  it("should handle minimal metadata", () => {
    const error = new ModuleResolutionError({
      reason: "cycle-detected",
    });

    expect(error.meta.reason).toBe("cycle-detected");
    expect(error.meta.httpStatus).toBe(500);
    expect(error.meta.module).toBeUndefined();
  });
});
