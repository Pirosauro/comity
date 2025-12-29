import { describe, it, expect } from "vitest";
import { resolveModuleOrder } from "../resolver.js";
import type { ModuleMeta } from "../../types.js";

describe("resolveModuleOrder", () => {
  it("should sort modules with no dependencies", () => {
    const modules: ModuleMeta[] = [
      {
        name: "a",
        setup: async () => async () => {},
        dependsOn: [],
        version: "0.0.0",
      },
      {
        name: "b",
        setup: async () => async () => {},
        dependsOn: [],
        version: "0.0.0",
      },
    ];

    const result = resolveModuleOrder(modules);
    expect(result.map((m) => m.name)).toEqual(["a", "b"]);
  });

  it("should sort modules by priority first", () => {
    const modules: ModuleMeta[] = [
      {
        name: "low",
        setup: async () => async () => {},
        dependsOn: [],
        priority: 200,
        version: "0.0.0",
      },
      {
        name: "high",
        setup: async () => async () => {},
        dependsOn: [],
        priority: 50,
        version: "0.0.0",
      },
    ];

    const result = resolveModuleOrder(modules);
    expect(result.map((m) => m.name)).toEqual(["high", "low"]);
  });

  it("should sort modules with dependencies", () => {
    const modules: ModuleMeta[] = [
      {
        name: "app",
        setup: async () => async () => {},
        dependsOn: ["auth", "db"],
        version: "0.0.0",
      },
      {
        name: "auth",
        setup: async () => async () => {},
        dependsOn: ["db"],
        version: "0.0.0",
      },
      {
        name: "db",
        setup: async () => async () => {},
        dependsOn: [],
        version: "0.0.0",
      },
    ];

    const result = resolveModuleOrder(modules);
    expect(result.map((m) => m.name)).toEqual(["db", "auth", "app"]);
  });

  it("should handle optional dependencies", () => {
    const modules: ModuleMeta[] = [
      {
        name: "app",
        setup: async () => async () => {},
        dependsOn: [],
        optionalDependsOn: ["optional"],
        version: "0.0.0",
      },
      {
        name: "optional",
        setup: async () => async () => {},
        dependsOn: [],
        version: "0.0.0",
      },
    ];

    const result = resolveModuleOrder(modules);
    expect(result.map((m) => m.name)).toEqual(["optional", "app"]);
  });

  it("should throw error for missing required dependency", () => {
    const modules: ModuleMeta[] = [
      {
        name: "app",
        setup: async () => async () => {},
        dependsOn: ["missing"],
        version: "0.0.0",
      },
    ];

    expect(() => resolveModuleOrder(modules)).toThrow(
      "Missing module dependency"
    );
  });

  it("should not throw error for missing optional dependency", () => {
    const modules: ModuleMeta[] = [
      {
        name: "app",
        setup: async () => async () => {},
        dependsOn: [],
        optionalDependsOn: ["missing"],
        version: "0.0.0",
      },
    ];

    const result = resolveModuleOrder(modules);
    expect(result.map((m) => m.name)).toEqual(["app"]);
  });

  it("should throw error for self-dependency", () => {
    const modules: ModuleMeta[] = [
      {
        name: "app",
        setup: async () => async () => {},
        dependsOn: ["app"],
        version: "0.0.0",
      },
    ];

    expect(() => resolveModuleOrder(modules)).toThrow(
      "Module cannot depend on itself"
    );
  });

  it("should throw error for circular dependency", () => {
    const modules: ModuleMeta[] = [
      {
        name: "a",
        setup: async () => async () => {},
        dependsOn: ["b"],
        version: "0.0.0",
      },
      {
        name: "b",
        setup: async () => async () => {},
        dependsOn: ["c"],
        version: "0.0.0",
      },
      {
        name: "c",
        setup: async () => async () => {},
        dependsOn: ["a"],
        version: "0.0.0",
      },
    ];

    expect(() => resolveModuleOrder(modules)).toThrow(
      "Module dependency cycle detected"
    );
  });

  it("should handle complex dependency graph", () => {
    const modules: ModuleMeta[] = [
      {
        name: "frontend",
        setup: async () => async () => {},
        dependsOn: ["api", "auth"],
        version: "0.0.0",
      },
      {
        name: "api",
        setup: async () => async () => {},
        dependsOn: ["db", "cache"],
        version: "0.0.0",
      },
      {
        name: "auth",
        setup: async () => async () => {},
        dependsOn: ["db", "email"],
        version: "0.0.0",
      },
      {
        name: "email",
        setup: async () => async () => {},
        dependsOn: ["config"],
        version: "0.0.0",
      },
      {
        name: "cache",
        setup: async () => async () => {},
        dependsOn: ["config"],
        version: "0.0.0",
      },
      {
        name: "db",
        setup: async () => async () => {},
        dependsOn: ["config"],
        version: "0.0.0",
      },
      {
        name: "config",
        setup: async () => async () => {},
        dependsOn: [],
        version: "0.0.0",
      },
    ];

    const result = resolveModuleOrder(modules);
    expect(result.map((m) => m.name)).toEqual([
      "config",
      "db",
      "cache",
      "api",
      "email",
      "auth",
      "frontend",
    ]);
  });
});
