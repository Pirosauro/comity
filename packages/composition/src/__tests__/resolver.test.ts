import { success } from "@comity/primitives/result";
import { describe, expect, it, vi } from "vitest";
import { CompositionError } from "../errors/composition.js";
import { resolveOrder } from "../resolver.js";

describe("resolveOrder", () => {
  it("should resolve modules with no dependencies", () => {
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

    const result = resolveOrder(modules);

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.value).toHaveLength(2);
      expect(result.value.map((m) => m.name)).toEqual(
        expect.arrayContaining(["moduleA", "moduleB"])
      );
    }
  });

  it("should resolve modules with dependencies", () => {
    const modules = [
      {
        name: "moduleA",
        dependsOn: { moduleB: {} },
        version: "1.0.0",
        setup: vi.fn(async () => success(async () => success(undefined))),
      },
      {
        name: "moduleB",
        version: "1.0.0",
        setup: vi.fn(async () => success(async () => success(undefined))),
      },
    ];
    const result = resolveOrder(modules);

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.value.map((m) => m.name)).toEqual(["moduleB", "moduleA"]);
    }
  });

  it("should handle complex dependencies", () => {
    const modules = [
      {
        name: "app",
        dependsOn: { auth: {}, db: {} },
        version: "1.0.0",
        setup: vi.fn(async () => success(async () => success(undefined))),
      },
      {
        name: "auth",
        dependsOn: { db: {} },
        version: "1.0.0",
        setup: vi.fn(async () => success(async () => success(undefined))),
      },
      {
        name: "db",
        version: "1.0.0",
        setup: vi.fn(async () => success(async () => success(undefined))),
      },
    ];

    const result = resolveOrder(modules);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.value.map((m) => m.name)).toEqual(["db", "auth", "app"]);
    }
  });

  it("should detect cycles", () => {
    const modules = [
      {
        name: "moduleA",
        dependsOn: { moduleB: {} },
        version: "1.0.0",
        setup: vi.fn(async () => success(async () => success(undefined))),
      },
      {
        name: "moduleB",
        dependsOn: { moduleA: {} },
        version: "1.0.0",
        setup: vi.fn(async () => success(async () => success(undefined))),
      },
    ];

    const result = resolveOrder(modules);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBeInstanceOf(CompositionError);
      expect(result.error.meta.reason).toBe("cycle_detected");
      expect(result.error.meta.details?.cycle).toContain("moduleA");
      expect(result.error.meta.details?.cycle).toContain("moduleB");
    }
  });

  it("should detect self-dependency", () => {
    const modules = [
      {
        name: "moduleA",
        dependsOn: { moduleA: {} },
        version: "1.0.0",
        setup: vi.fn(async () => success(async () => success(undefined))),
      },
    ];

    const result = resolveOrder(modules);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.meta.reason).toBe("cycle_detected");
      expect(result.error.meta.details?.cycle).toEqual(["moduleA"]);
    }
  });

  it("should handle missing dependencies", () => {
    const modules = [
      {
        name: "moduleA",
        dependsOn: { missing: {} },
        version: "1.0.0",
        setup: vi.fn(async () => success(async () => success(undefined))),
      },
    ];

    const result = resolveOrder(modules);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBeInstanceOf(CompositionError);
      expect(result.error.meta.reason).toBe("missing_dependency");
      expect(result.error.meta.details?.module).toBe("moduleA");
      expect(result.error.meta.details?.dependency).toBe("missing");
    }
  });

  it("should handle optional dependencies", () => {
    const modules = [
      {
        name: "moduleA",
        dependsOn: { missing: { optional: true } },
        version: "1.0.0",
        setup: vi.fn(async () => success(async () => success(undefined))),
      },
      {
        name: "moduleB",
        version: "1.0.0",
        setup: vi.fn(async () => success(async () => success(undefined))),
      },
    ];

    const result = resolveOrder(modules);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.value).toHaveLength(2);
    }
  });

  it("should resolve optional dependencies when they exist", () => {
    const modules = [
      {
        name: "moduleA",
        dependsOn: { moduleB: { optional: true } },
        version: "1.0.0",
        setup: vi.fn(async () => success(async () => success(undefined))),
      },
      {
        name: "moduleB",
        version: "1.0.0",
        setup: vi.fn(async () => success(async () => success(undefined))),
      },
    ];

    const result = resolveOrder(modules);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.value.map((m) => m.name)).toEqual(["moduleB", "moduleA"]);
    }
  });

  it("should handle both dependsOn and optionalDependsOn", () => {
    const modules = [
      {
        name: "moduleA",
        dependsOn: { moduleB: {}, moduleC: { optional: true }, missing: { optional: true } },
        version: "1.0.0",
        setup: vi.fn(async () => success(async () => success(undefined))),
      },
      {
        name: "moduleB",
        version: "1.0.0",
        setup: vi.fn(async () => success(async () => success(undefined))),
      },
      {
        name: "moduleC",
        version: "1.0.0",
        setup: vi.fn(async () => success(async () => success(undefined))),
      },
    ];

    const result = resolveOrder(modules);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.value).toHaveLength(3);
      // moduleB and moduleC should come before moduleA
      const moduleAIndex = result.value.findIndex((m) => m.name === "moduleA");
      const moduleBIndex = result.value.findIndex((m) => m.name === "moduleB");
      const moduleCIndex = result.value.findIndex((m) => m.name === "moduleC");

      expect(moduleBIndex).toBeLessThan(moduleAIndex);
      expect(moduleCIndex).toBeLessThan(moduleAIndex);
    }
  });

  it("should sort by priority", () => {
    const modules = [
      {
        name: "low",
        priority: 200,
        version: "1.0.0",
        setup: vi.fn(async () => success(async () => success(undefined))),
      },
      {
        name: "high",
        priority: 50,
        version: "1.0.0",
        setup: vi.fn(async () => success(async () => success(undefined))),
      },
      {
        name: "default",
        priority: 100,
        version: "1.0.0",
        setup: vi.fn(async () => success(async () => success(undefined))),
      },
    ];

    const result = resolveOrder(modules);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.value.map((m) => m.name)).toEqual(["high", "default", "low"]);
    }
  });

  it("should handle empty modules array", () => {
    const result = resolveOrder([]);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.value).toEqual([]);
    }
  });

  it("should handle readonly array", () => {
    const modules = [{ name: "moduleA" }] as const;

    const result = resolveOrder(modules as readonly any[]);

    expect(result.success).toBe(true);
  });
});
