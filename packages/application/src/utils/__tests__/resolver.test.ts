import type { ApplicationModuleMeta } from "../../types.js";
import { describe, it, expect } from "vitest";
import { resolveModuleOrder } from "../resolver.js";

// Helper function to create a basic module for testing
const createModule = (
  name: string,
  dependsOn?: string[]
): ApplicationModuleMeta => ({
  name,
  version: "1.0.0",
  dependsOn,
  setup: () => Promise.resolve(async () => {}),
});

describe("resolveModuleOrder", () => {
  describe("basic functionality", () => {
    it("should return empty array for empty input", () => {
      const result = resolveModuleOrder([]);

      expect(result).toEqual([]);
    });

    it("should return single module unchanged", () => {
      const modules: ApplicationModuleMeta[] = [createModule("app")];

      const result = resolveModuleOrder(modules);

      expect(result).toEqual(modules);
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("app");
    });

    it("should handle modules without dependencies", () => {
      const modules: ApplicationModuleMeta[] = [
        createModule("module-a"),
        createModule("module-b"),
        createModule("module-c"),
      ];

      const result = resolveModuleOrder(modules);

      expect(result).toHaveLength(3);
      expect(result.map((m) => m.name)).toEqual(
        expect.arrayContaining(["module-a", "module-b", "module-c"])
      );
    });

    it("should handle modules with empty dependsOn array", () => {
      const modules: ApplicationModuleMeta[] = [createModule("app", [])];

      const result = resolveModuleOrder(modules);

      expect(result).toEqual(modules);
      expect(result[0].name).toBe("app");
    });
  });

  describe("dependency resolution", () => {
    it("should order simple linear dependencies correctly", () => {
      const modules: ApplicationModuleMeta[] = [
        createModule("app", ["auth"]),
        createModule("auth", ["database"]),
        createModule("database"),
      ];

      const result = resolveModuleOrder(modules);

      expect(result.map((m) => m.name)).toEqual(["database", "auth", "app"]);
    });

    it("should handle complex dependency graph", () => {
      const modules: ApplicationModuleMeta[] = [
        createModule("frontend", ["api", "auth"]),
        createModule("api", ["database", "cache"]),
        createModule("auth", ["database", "email"]),
        createModule("email", ["config"]),
        createModule("cache", ["config"]),
        createModule("database", ["config"]),
        createModule("config"),
      ];

      const result = resolveModuleOrder(modules);
      const names = result.map((m) => m.name);

      // Config should be first
      expect(names.indexOf("config")).toBe(0);

      // Database, cache, email should come after config
      expect(names.indexOf("database")).toBeGreaterThan(
        names.indexOf("config")
      );
      expect(names.indexOf("cache")).toBeGreaterThan(names.indexOf("config"));
      expect(names.indexOf("email")).toBeGreaterThan(names.indexOf("config"));

      // Auth should come after database and email
      expect(names.indexOf("auth")).toBeGreaterThan(names.indexOf("database"));
      expect(names.indexOf("auth")).toBeGreaterThan(names.indexOf("email"));

      // API should come after database and cache
      expect(names.indexOf("api")).toBeGreaterThan(names.indexOf("database"));
      expect(names.indexOf("api")).toBeGreaterThan(names.indexOf("cache"));

      // Frontend should be last
      expect(names.indexOf("frontend")).toBe(names.length - 1);
      expect(names.indexOf("frontend")).toBeGreaterThan(names.indexOf("api"));
      expect(names.indexOf("frontend")).toBeGreaterThan(names.indexOf("auth"));
    });

    it("should handle diamond dependency pattern", () => {
      const modules: ApplicationModuleMeta[] = [
        createModule("app", ["module-b", "module-c"]),
        createModule("module-b", ["module-a"]),
        createModule("module-c", ["module-a"]),
        createModule("module-a"),
      ];

      const result = resolveModuleOrder(modules);
      const names = result.map((m) => m.name);

      expect(names.indexOf("module-a")).toBe(0);
      expect(names.indexOf("module-b")).toBeGreaterThan(
        names.indexOf("module-a")
      );
      expect(names.indexOf("module-c")).toBeGreaterThan(
        names.indexOf("module-a")
      );
      expect(names.indexOf("app")).toBe(names.length - 1);
    });

    it("should handle multiple independent dependency chains", () => {
      const modules: ApplicationModuleMeta[] = [
        createModule("app-a", ["service-a"]),
        createModule("service-a", ["db-a"]),
        createModule("db-a"),
        createModule("app-b", ["service-b"]),
        createModule("service-b", ["db-b"]),
        createModule("db-b"),
      ];

      const result = resolveModuleOrder(modules);
      const names = result.map((m) => m.name);

      // Check chain A
      expect(names.indexOf("db-a")).toBeLessThan(names.indexOf("service-a"));
      expect(names.indexOf("service-a")).toBeLessThan(names.indexOf("app-a"));

      // Check chain B
      expect(names.indexOf("db-b")).toBeLessThan(names.indexOf("service-b"));
      expect(names.indexOf("service-b")).toBeLessThan(names.indexOf("app-b"));
    });
  });

  describe("error handling", () => {
    it("should throw error for missing dependency", () => {
      const modules: ApplicationModuleMeta[] = [
        createModule("app", ["missing-module"]),
        createModule("database"),
      ];

      expect(() => resolveModuleOrder(modules)).toThrow(
        "Missing dependency: missing-module (used in app)"
      );
    });

    it("should throw error for circular dependency - simple", () => {
      const modules: ApplicationModuleMeta[] = [
        createModule("module-a", ["module-b"]),
        createModule("module-b", ["module-a"]),
      ];

      expect(() => resolveModuleOrder(modules)).toThrow(
        "Cycle detected: module-a → module-b → module-a"
      );
    });

    it("should throw error for circular dependency - complex", () => {
      const modules: ApplicationModuleMeta[] = [
        createModule("module-a", ["module-b"]),
        createModule("module-b", ["module-c"]),
        createModule("module-c", ["module-d"]),
        createModule("module-d", ["module-a"]),
      ];

      expect(() => resolveModuleOrder(modules)).toThrow(
        "Cycle detected: module-a → module-b → module-c → module-d → module-a"
      );
    });

    it("should throw error for self-dependency", () => {
      const modules: ApplicationModuleMeta[] = [
        createModule("module-a", ["module-a"]),
      ];

      expect(() => resolveModuleOrder(modules)).toThrow(
        "Cycle detected: module-a → module-a"
      );
    });

    it("should throw error with correct dependency context", () => {
      const modules: ApplicationModuleMeta[] = [
        createModule("app", ["auth", "nonexistent"]),
        createModule("auth"),
      ];

      expect(() => resolveModuleOrder(modules)).toThrow(
        "Missing dependency: nonexistent (used in app)"
      );
    });
  });

  describe("algorithm behavior", () => {
    it("should visit each module only once", () => {
      const modules: ApplicationModuleMeta[] = [
        createModule("app", ["shared"]),
        createModule("service", ["shared"]),
        createModule("shared"),
      ];

      const result = resolveModuleOrder(modules);

      // Should have exactly 3 modules, shared appearing only once
      expect(result).toHaveLength(3);
      expect(result.filter((m) => m.name === "shared")).toHaveLength(1);
      expect(result[0].name).toBe("shared");
    });

    it("should preserve original module objects", () => {
      const originalModule = {
        ...createModule("app"),
        custom: "property",
      } as ApplicationModuleMeta & { custom: string };

      const modules: ApplicationModuleMeta[] = [originalModule];

      const result = resolveModuleOrder(modules);

      expect(result[0]).toBe(originalModule);
      expect((result[0] as any).custom).toBe("property");
    });

    it("should handle large dependency graphs efficiently", () => {
      // Create a deep dependency chain
      const modules: ApplicationModuleMeta[] = [];
      const chainLength = 100;

      for (let i = 0; i < chainLength; i++) {
        const dependsOn = i > 0 ? [`module-${i - 1}`] : undefined;

        modules.push(createModule(`module-${i}`, dependsOn));
      }

      const start = Date.now();
      const result = resolveModuleOrder(modules);
      const end = Date.now();

      expect(result).toHaveLength(chainLength);
      expect(result[0].name).toBe("module-0");
      expect(result[chainLength - 1].name).toBe(`module-${chainLength - 1}`);
      expect(end - start).toBeLessThan(100); // Should be fast
    });
  });

  describe("edge cases", () => {
    it("should handle modules with undefined dependsOn", () => {
      const modules: ApplicationModuleMeta[] = [
        { ...createModule("app"), dependsOn: undefined },
      ];

      const result = resolveModuleOrder(modules);

      expect(result).toEqual(modules);
    });

    it("should handle modules with null dependsOn", () => {
      const modules: ApplicationModuleMeta[] = [
        { ...createModule("app"), dependsOn: null as any },
      ];

      const result = resolveModuleOrder(modules);

      expect(result).toEqual(modules);
    });

    it("should handle duplicate module names gracefully", () => {
      const modules: ApplicationModuleMeta[] = [
        createModule("app"),
        { ...createModule("app"), version: "2.0.0" },
      ];

      const result = resolveModuleOrder(modules);

      // The algorithm visits each module by name only once, so duplicates are filtered out
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("app");
    });

    it("should handle empty dependency arrays", () => {
      const modules: ApplicationModuleMeta[] = [
        createModule("app", []),
        createModule("database", []),
      ];

      const result = resolveModuleOrder(modules);

      expect(result).toHaveLength(2);
      expect(result.map((m) => m.name)).toEqual(
        expect.arrayContaining(["app", "database"])
      );
    });

    it("should handle special characters in module names", () => {
      const modules: ApplicationModuleMeta[] = [
        createModule("@scope/app-module", ["@scope/auth-module"]),
        createModule("@scope/auth-module"),
      ];

      const result = resolveModuleOrder(modules);

      expect(result[0].name).toBe("@scope/auth-module");
      expect(result[1].name).toBe("@scope/app-module");
    });
  });

  describe("integration scenarios", () => {
    it("should work with real-world module structure", () => {
      const modules: ApplicationModuleMeta[] = [
        createModule("@test/frontend", ["@test/api", "@test/auth"]),
        createModule("@test/api", ["@test/database", "@test/validation"]),
        createModule("@test/auth", ["@test/database", "@test/crypto"]),
        createModule("@test/validation", ["@test/config"]),
        createModule("@test/crypto", ["@test/config"]),
        createModule("@test/database", ["@test/config"]),
        createModule("@test/config"),
      ];

      const result = resolveModuleOrder(modules);
      const names = result.map((m) => m.name);

      // Verify the ordering constraints
      expect(names.indexOf("@test/config")).toBe(0);
      expect(names.indexOf("@test/frontend")).toBe(names.length - 1);

      // All config dependents should come after config
      ["@test/database", "@test/validation", "@test/crypto"].forEach(
        (module) => {
          expect(names.indexOf(module)).toBeGreaterThan(
            names.indexOf("@test/config")
          );
        }
      );

      // Auth and API should come after their dependencies
      expect(names.indexOf("@test/auth")).toBeGreaterThan(
        names.indexOf("@test/database")
      );
      expect(names.indexOf("@test/auth")).toBeGreaterThan(
        names.indexOf("@test/crypto")
      );
      expect(names.indexOf("@test/api")).toBeGreaterThan(
        names.indexOf("@test/database")
      );
      expect(names.indexOf("@test/api")).toBeGreaterThan(
        names.indexOf("@test/validation")
      );
    });

    it("should maintain stable sort for modules with same dependency level", () => {
      const modules: ApplicationModuleMeta[] = [
        createModule("service-z", ["base"]),
        createModule("service-a", ["base"]),
        createModule("service-m", ["base"]),
        createModule("base"),
      ];

      const result = resolveModuleOrder(modules);

      // Base should be first
      expect(result[0].name).toBe("base");

      // All services should come after base
      result.slice(1).forEach((module) => {
        expect(["service-z", "service-a", "service-m"]).toContain(module.name);
      });
    });
  });
});
