import { describe, expect, it } from "vitest";
import { ModuleResolutionError } from "../../errors/module-resolution.js";
import { resolveModuleOrder } from "../resolver.js";

describe("resolveModuleOrder", () => {
  it("should resolve modules with no dependencies", () => {
    const modules = [
      { name: "moduleA", version: "1.0.0" },
      { name: "moduleB", version: "1.0.0" },
    ];

    const result = resolveModuleOrder(modules as any[]);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.value).toHaveLength(2);
      expect(result.value.map((m) => m.name)).toEqual(
        expect.arrayContaining(["moduleA", "moduleB"]),
      );
    }
  });

  it("should resolve modules with dependencies", () => {
    const modules = [
      { name: "moduleA", dependsOn: ["moduleB"] },
      { name: "moduleB" },
    ];

    const result = resolveModuleOrder(modules as any[]);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.value.map((m) => m.name)).toEqual(["moduleB", "moduleA"]);
    }
  });

  it("should handle complex dependencies", () => {
    const modules = [
      { name: "app", dependsOn: ["auth", "db"] },
      { name: "auth", dependsOn: ["db"] },
      { name: "db" },
    ];

    const result = resolveModuleOrder(modules as any[]);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.value.map((m) => m.name)).toEqual(["db", "auth", "app"]);
    }
  });

  it("should detect cycles", () => {
    const modules = [
      { name: "moduleA", dependsOn: ["moduleB"] },
      { name: "moduleB", dependsOn: ["moduleA"] },
    ];

    const result = resolveModuleOrder(modules as any[]);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBeInstanceOf(ModuleResolutionError);
      expect(result.error.meta.reason).toBe("cycle_detected");
      expect(result.error.meta.cycle).toContain("moduleA");
      expect(result.error.meta.cycle).toContain("moduleB");
    }
  });

  it("should detect self-dependency", () => {
    const modules = [{ name: "moduleA", dependsOn: ["moduleA"] }];

    const result = resolveModuleOrder(modules as any[]);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.meta.reason).toBe("cycle_detected");
      expect(result.error.meta.cycle).toEqual(["moduleA"]);
    }
  });

  it("should handle missing dependencies", () => {
    const modules = [{ name: "moduleA", dependsOn: ["missing"] }];

    const result = resolveModuleOrder(modules as any[]);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBeInstanceOf(ModuleResolutionError);
      expect(result.error.meta.reason).toBe("missing_dependency");
      expect(result.error.meta.module).toBe("moduleA");
      expect(result.error.meta.dependency).toBe("missing");
    }
  });

  it("should handle optional dependencies", () => {
    const modules = [
      { name: "moduleA", optionalDependsOn: ["missing"] },
      { name: "moduleB" },
    ];

    const result = resolveModuleOrder(modules as any[]);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.value).toHaveLength(2);
    }
  });

  it("should sort by priority", () => {
    const modules = [
      { name: "low", priority: 200 },
      { name: "high", priority: 50 },
      { name: "default", priority: 100 },
    ];

    const result = resolveModuleOrder(modules as any[]);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.value.map((m) => m.name)).toEqual([
        "high",
        "default",
        "low",
      ]);
    }
  });

  it("should handle empty modules array", () => {
    const result = resolveModuleOrder([]);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.value).toEqual([]);
    }
  });

  it("should handle readonly array", () => {
    const modules = [{ name: "moduleA" }] as const;

    const result = resolveModuleOrder(modules as readonly any[]);

    expect(result.success).toBe(true);
  });
});
