import type { ValidatedModuleMeta } from "../module-meta.js";
import { describe, it, expect } from "vitest";
import { z } from "zod";
import { moduleMetaSchema } from "../module-meta.js";

// Helper function to create a valid module for testing
const createValidModule = (overrides: Partial<ValidatedModuleMeta> = {}) => ({
  name: "test-module",
  version: "1.0.0",
  setup: () => Promise.resolve(async () => {}),
  ...overrides,
});

describe("moduleMetaSchema", () => {
  describe("valid module metadata", () => {
    it("should validate minimal valid module", () => {
      const module = createValidModule();

      const result = moduleMetaSchema.parse(module);

      expect(result).toEqual(module);
      expect(result.name).toBe("test-module");
      expect(result.version).toBe("1.0.0");
      expect(typeof result.setup).toBe("function");
    });

    it("should validate module with all optional fields", () => {
      const module = createValidModule({
        dependsOn: ["auth", "database"],
        incompatibleWith: ["legacy-module"],
        configSchema: z.object({ port: z.number() }),
      });

      const result = moduleMetaSchema.parse(module);

      expect(result.dependsOn).toEqual(["auth", "database"]);
      expect(result.incompatibleWith).toEqual(["legacy-module"]);
      expect(result.configSchema).toBeDefined();
    });

    it("should validate empty dependency arrays", () => {
      const module = createValidModule({
        dependsOn: [],
        incompatibleWith: [],
      });

      const result = moduleMetaSchema.parse(module);

      expect(result.dependsOn).toEqual([]);
      expect(result.incompatibleWith).toEqual([]);
    });

    it("should validate scoped module names", () => {
      const module = createValidModule({
        name: "@mycompany/user-module",
      });

      const result = moduleMetaSchema.parse(module);

      expect(result.name).toBe("@mycompany/user-module");
    });

    it("should validate various version formats", () => {
      const validVersions = ["1.0.0", "0.1.0", "10.20.30", "999.999.999"];

      validVersions.forEach((version) => {
        const module = createValidModule({ version });

        expect(() => moduleMetaSchema.parse(module)).not.toThrow();

        const result = moduleMetaSchema.parse(module);
        expect(result.version).toBe(version);
      });
    });

    it("should validate complex config schemas", () => {
      const configSchema = z.object({
        database: z.object({
          host: z.string(),
          port: z.number().min(1).max(65535),
          ssl: z.boolean().default(true),
        }),
        features: z.array(z.string()).optional(),
        timeout: z.number().positive().default(5000),
      });

      const module = createValidModule({ configSchema });

      const result = moduleMetaSchema.parse(module);

      expect(result.configSchema).toBe(configSchema);
    });

    it("should validate modules with special characters in names", () => {
      const specialNames = [
        "module-with-dashes",
        "module_with_underscores",
        "module.with.dots",
        "@scope/module-name",
        "123-numeric-start",
      ];

      specialNames.forEach((name) => {
        const module = createValidModule({ name });

        expect(() => moduleMetaSchema.parse(module)).not.toThrow();

        const result = moduleMetaSchema.parse(module);
        expect(result.name).toBe(name);
      });
    });
  });

  describe("invalid module metadata", () => {
    describe("name validation", () => {
      it("should reject empty string name", () => {
        const module = createValidModule({ name: "" });

        expect(() => moduleMetaSchema.parse(module)).toThrow(
          "Module name must be a non-empty string."
        );
      });

      it("should reject non-string name", () => {
        const module = { ...createValidModule(), name: 123 };

        expect(() => moduleMetaSchema.parse(module)).toThrow();
      });

      it("should reject undefined name", () => {
        const module = { ...createValidModule() };
        delete (module as any).name;

        expect(() => moduleMetaSchema.parse(module)).toThrow();
      });

      it("should reject null name", () => {
        const module = { ...createValidModule(), name: null };

        expect(() => moduleMetaSchema.parse(module)).toThrow();
      });
    });

    describe("version validation", () => {
      it("should reject invalid version formats", () => {
        const invalidVersions = [
          "1.0", // Missing patch version
          "1", // Missing minor and patch
          "1.0.0.0", // Too many segments
          "v1.0.0", // Has 'v' prefix
          "1.0.0-beta", // Has pre-release suffix
          "1.0.0+build", // Has build metadata
          "1.x.0", // Non-numeric segments
          "", // Empty string
          "latest", // Non-numeric
          "1.0.0 ", // Trailing space
          " 1.0.0", // Leading space
        ];

        invalidVersions.forEach((version) => {
          const module = createValidModule({ version });

          expect(() => moduleMetaSchema.parse(module)).toThrow(
            "Invalid version format. Expected semantic versioning (e.g. 1.0.0)"
          );
        });
      });

      it("should reject non-string version", () => {
        const module = { ...createValidModule(), version: 1.0 };

        expect(() => moduleMetaSchema.parse(module)).toThrow();
      });

      it("should reject undefined version", () => {
        const module = { ...createValidModule() };
        delete (module as any).version;

        expect(() => moduleMetaSchema.parse(module)).toThrow();
      });
    });

    describe("dependsOn validation", () => {
      it("should reject empty string dependencies", () => {
        const module = createValidModule({
          dependsOn: ["valid-dep", "", "another-valid-dep"],
        });

        expect(() => moduleMetaSchema.parse(module)).toThrow(
          "Dependency names must be non-empty strings."
        );
      });

      it("should reject non-string dependencies", () => {
        const module = createValidModule({
          dependsOn: ["valid-dep", 123 as any, "another-dep"],
        });

        expect(() => moduleMetaSchema.parse(module)).toThrow();
      });

      it("should reject non-array dependsOn", () => {
        const module = { ...createValidModule(), dependsOn: "single-dep" };

        expect(() => moduleMetaSchema.parse(module)).toThrow();
      });

      it("should allow undefined dependsOn", () => {
        const module = createValidModule({ dependsOn: undefined });

        expect(() => moduleMetaSchema.parse(module)).not.toThrow();

        const result = moduleMetaSchema.parse(module);
        expect(result.dependsOn).toBeUndefined();
      });
    });

    describe("incompatibleWith validation", () => {
      it("should reject empty string incompatible modules", () => {
        const module = createValidModule({
          incompatibleWith: ["valid-module", "", "another-module"],
        });

        expect(() => moduleMetaSchema.parse(module)).toThrow(
          "Incompatible module names must be non-empty strings."
        );
      });

      it("should reject non-string incompatible modules", () => {
        const module = createValidModule({
          incompatibleWith: ["valid-module", null as any],
        });

        expect(() => moduleMetaSchema.parse(module)).toThrow();
      });

      it("should reject non-array incompatibleWith", () => {
        const module = {
          ...createValidModule(),
          incompatibleWith: "single-module",
        };

        expect(() => moduleMetaSchema.parse(module)).toThrow();
      });

      it("should allow undefined incompatibleWith", () => {
        const module = createValidModule({ incompatibleWith: undefined });

        expect(() => moduleMetaSchema.parse(module)).not.toThrow();

        const result = moduleMetaSchema.parse(module);
        expect(result.incompatibleWith).toBeUndefined();
      });
    });

    describe("configSchema validation", () => {
      it("should reject non-Zod schema objects", () => {
        const module = createValidModule({
          configSchema: { type: "object" } as any,
        });

        expect(() => moduleMetaSchema.parse(module)).toThrow(
          "Config schema must be a valid Zod type."
        );
      });

      it("should reject primitive values as config schema", () => {
        const invalidSchemas = ["string", 123, true, null, []];

        invalidSchemas.forEach((configSchema) => {
          const module = createValidModule({
            configSchema: configSchema as any,
          });

          expect(() => moduleMetaSchema.parse(module)).toThrow(
            "Config schema must be a valid Zod type."
          );
        });
      });

      it("should allow undefined configSchema", () => {
        const module = createValidModule({ configSchema: undefined });

        expect(() => moduleMetaSchema.parse(module)).not.toThrow();

        const result = moduleMetaSchema.parse(module);
        expect(result.configSchema).toBeUndefined();
      });

      it("should accept valid Zod schemas", () => {
        const validSchemas = [
          z.string(),
          z.number(),
          z.object({ key: z.string() }),
          z.array(z.number()),
          z.union([z.string(), z.number()]),
          z.optional(z.string()),
        ];

        validSchemas.forEach((configSchema) => {
          const module = createValidModule({ configSchema });

          expect(() => moduleMetaSchema.parse(module)).not.toThrow();

          const result = moduleMetaSchema.parse(module);
          expect(result.configSchema).toBe(configSchema);
        });
      });
    });

    describe("setup function validation", () => {
      it("should reject non-function setup", () => {
        const invalidSetups = ["function", 123, {}, [], null, undefined];

        invalidSetups.forEach((setup) => {
          const module = { ...createValidModule(), setup };

          expect(() => moduleMetaSchema.parse(module)).toThrow(
            "Module must provide a setup function."
          );
        });
      });

      it("should reject missing setup function", () => {
        const module = { ...createValidModule() };
        delete (module as any).setup;

        expect(() => moduleMetaSchema.parse(module)).toThrow(
          "Module must provide a setup function."
        );
      });

      it("should accept any function as setup", () => {
        const validSetups = [
          () => Promise.resolve(async () => {}),
          function () {
            return Promise.resolve(async () => {});
          },
          async () => async () => {},
          () => {
            return Promise.resolve(async () => {});
          },
        ];

        validSetups.forEach((setup) => {
          const module = createValidModule({ setup });

          expect(() => moduleMetaSchema.parse(module)).not.toThrow();

          const result = moduleMetaSchema.parse(module);
          expect(typeof result.setup).toBe("function");
        });
      });
    });
  });

  describe("type inference", () => {
    it("should infer correct TypeScript types", () => {
      const module = createValidModule({
        dependsOn: ["auth"],
        configSchema: z.object({ port: z.number() }),
      });

      const result: ValidatedModuleMeta = moduleMetaSchema.parse(module);

      // These should compile without TypeScript errors
      expect(typeof result.name).toBe("string");
      expect(typeof result.version).toBe("string");
      expect(typeof result.setup).toBe("function");
      expect(Array.isArray(result.dependsOn)).toBe(true);
      expect(result.dependsOn![0]).toBe("auth");
      expect(result.configSchema).toBeDefined();
    });

    it("should handle optional fields correctly", () => {
      const minimalModule = createValidModule();

      const result: ValidatedModuleMeta = moduleMetaSchema.parse(minimalModule);

      expect(result.dependsOn).toBeUndefined();
      expect(result.incompatibleWith).toBeUndefined();
      expect(result.configSchema).toBeUndefined();
    });
  });

  describe("real-world scenarios", () => {
    it("should validate a complete auth module", () => {
      const authModule = {
        name: "@myapp/auth",
        version: "2.1.3",
        dependsOn: ["@myapp/database", "@myapp/crypto"],
        incompatibleWith: ["@myapp/legacy-auth"],
        configSchema: z.object({
          jwtSecret: z.string().min(32),
          sessionTimeout: z.number().positive().default(3600),
          enableTwoFactor: z.boolean().default(false),
          providers: z
            .array(z.enum(["google", "github", "facebook"]))
            .optional(),
        }),
        setup: (options: any) =>
          Promise.resolve(async (ctx: any) => {
            // Auth module setup logic
          }),
      };

      expect(() => moduleMetaSchema.parse(authModule)).not.toThrow();

      const result = moduleMetaSchema.parse(authModule);
      expect(result.name).toBe("@myapp/auth");
      expect(result.dependsOn).toHaveLength(2);
      expect(result.incompatibleWith).toHaveLength(1);
      expect(result.configSchema).toBeDefined();
    });

    it("should validate a simple utility module", () => {
      const utilModule = {
        name: "utils",
        version: "1.0.0",
        setup: () =>
          Promise.resolve(async () => {
            console.log("Utils loaded");
          }),
      };

      expect(() => moduleMetaSchema.parse(utilModule)).not.toThrow();

      const result = moduleMetaSchema.parse(utilModule);
      expect(result.name).toBe("utils");
      expect(result.dependsOn).toBeUndefined();
      expect(result.incompatibleWith).toBeUndefined();
      expect(result.configSchema).toBeUndefined();
    });

    it("should validate modules with complex dependencies", () => {
      const frontendModule = {
        name: "@myapp/frontend",
        version: "3.0.0",
        dependsOn: ["@myapp/api", "@myapp/auth", "@myapp/i18n", "@myapp/theme"],
        incompatibleWith: ["@myapp/mobile-app", "@myapp/legacy-frontend"],
        configSchema: z.object({
          baseUrl: z.string().url(),
          environment: z.enum(["development", "staging", "production"]),
          features: z.object({
            darkMode: z.boolean().default(true),
            analytics: z.boolean().default(false),
            debugMode: z.boolean().default(false),
          }),
        }),
        setup: () => Promise.resolve(async () => {}),
      };

      expect(() => moduleMetaSchema.parse(frontendModule)).not.toThrow();

      const result = moduleMetaSchema.parse(frontendModule);
      expect(result.dependsOn).toHaveLength(4);
      expect(result.incompatibleWith).toHaveLength(2);
    });
  });

  describe("error messages", () => {
    it("should provide clear error messages for validation failures", () => {
      const invalidModule = {
        name: "",
        version: "1.0",
        dependsOn: ["valid-dep", ""],
        setup: "not-a-function",
      };

      try {
        moduleMetaSchema.parse(invalidModule);
        expect.fail("Should have thrown validation error");
      } catch (error: any) {
        expect(error.issues).toBeDefined();
        expect(error.issues.length).toBeGreaterThan(0);

        const messages = error.issues.map((issue: any) => issue.message);
        expect(messages).toContain("Module name must be a non-empty string.");
        expect(messages).toContain(
          "Invalid version format. Expected semantic versioning (e.g. 1.0.0)"
        );
        expect(messages).toContain(
          "Dependency names must be non-empty strings."
        );
        expect(messages).toContain("Module must provide a setup function.");
      }
    });

    it("should include field paths in error messages", () => {
      const invalidModule = {
        name: "valid-name",
        version: "1.0.0",
        dependsOn: ["", "valid-dep"],
        setup: () => Promise.resolve(async () => {}),
      };

      try {
        moduleMetaSchema.parse(invalidModule);
        expect.fail("Should have thrown validation error");
      } catch (error: any) {
        expect(error.issues[0].path).toEqual(["dependsOn", 0]);
      }
    });
  });

  describe("schema composition", () => {
    it("should work with schema extensions", () => {
      const extendedSchema = moduleMetaSchema.extend({
        author: z.string().optional(),
        license: z.string().default("MIT"),
      });

      const module = {
        ...createValidModule(),
        author: "John Doe",
        license: "Apache-2.0",
      };

      expect(() => extendedSchema.parse(module)).not.toThrow();

      const result = extendedSchema.parse(module);
      expect(result.author).toBe("John Doe");
      expect(result.license).toBe("Apache-2.0");
    });

    it("should work with schema transformations", () => {
      const transformedSchema = moduleMetaSchema.transform((data) => ({
        ...data,
        normalizedName: data.name.toLowerCase().replace(/[^a-z0-9]/g, "-"),
      }));

      const module = createValidModule({ name: "@MyApp/User-Module" });

      const result = transformedSchema.parse(module);
      expect(result.normalizedName).toBe("-myapp-user-module");
    });
  });
});
