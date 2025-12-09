import type { UserConfig } from "vite";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { withComity } from "../with-comity.js";
import * as fs from "node:fs";

// Mock fs module
vi.mock("node:fs");

describe("withComity", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("configuration generation", () => {
    it("should return a valid Vite UserConfig object", () => {
      const config = withComity({}) as any;

      expect(config).toBeDefined();
      expect(config).toHaveProperty("resolve");
    });

    it("should include resolve.alias configuration", () => {
      const config = withComity({}) as any;

      expect(config.resolve).toBeDefined();
      expect(config.resolve?.alias).toBeDefined();
      expect(Array.isArray(config.resolve?.alias)).toBe(true);
    });

    it("should configure alias with regex pattern", () => {
      const config = withComity({}) as any;
      const aliases = config.resolve?.alias as any[];

      expect(aliases).toHaveLength(1);
      expect(aliases[0]).toHaveProperty("find");
      expect(aliases[0].find).toBeInstanceOf(RegExp);
    });

    it("should configure alias replacement path", () => {
      const config = withComity({}) as any;
      const aliases = config.resolve?.alias as any[];

      expect(aliases[0]).toHaveProperty("replacement");
      expect(typeof aliases[0].replacement).toBe("string");
      expect(aliases[0].replacement).toContain("src/overrides");
    });

    it("should include customResolver function", () => {
      const config = withComity({}) as any;
      const aliases = config.resolve?.alias as any[];

      expect(aliases[0]).toHaveProperty("customResolver");
      expect(typeof aliases[0].customResolver).toBe("function");
    });
  });

  describe("customResolver behavior", () => {
    it("should return source path when file exists", () => {
      const mockExistsSync = vi.spyOn(fs, "existsSync").mockReturnValue(true);
      const mockStatSync = vi.spyOn(fs, "statSync").mockReturnValue({
        isFile: () => true,
      } as any);

      const config = withComity({}) as UserConfig;
      const aliases = config.resolve?.alias as any[];
      const customResolver = aliases[0].customResolver;

      const result = customResolver("/path/to/override.js");

      expect(result).toBe("/path/to/override.js");
      expect(mockExistsSync).toHaveBeenCalledWith("/path/to/override.js");
      expect(mockStatSync).toHaveBeenCalledWith("/path/to/override.js");
    });

    it("should return null when file does not exist", () => {
      const mockExistsSync = vi.spyOn(fs, "existsSync").mockReturnValue(false);

      const config = withComity({}) as UserConfig;
      const aliases = config.resolve?.alias as any[];
      const customResolver = aliases[0].customResolver;

      const result = customResolver("/path/to/nonexistent.js");

      expect(result).toBeNull();
      expect(mockExistsSync).toHaveBeenCalledWith("/path/to/nonexistent.js");
    });

    it("should return null when path is a directory", () => {
      const mockExistsSync = vi.spyOn(fs, "existsSync").mockReturnValue(true);
      const mockStatSync = vi.spyOn(fs, "statSync").mockReturnValue({
        isFile: () => false,
      } as any);

      const config = withComity({}) as UserConfig;
      const aliases = config.resolve?.alias as any[];
      const customResolver = aliases[0].customResolver;

      const result = customResolver("/path/to/directory");

      expect(result).toBeNull();
    });

    it("should return null when fs operation throws error", () => {
      const mockExistsSync = vi
        .spyOn(fs, "existsSync")
        .mockImplementation(() => {
          throw new Error("File system error");
        });

      const config = withComity({}) as UserConfig;
      const aliases = config.resolve?.alias as any[];
      const customResolver = aliases[0].customResolver;

      const result = customResolver("/path/to/file.js");

      expect(result).toBeNull();
    });

    it("should handle statSync throwing error", () => {
      const mockExistsSync = vi.spyOn(fs, "existsSync").mockReturnValue(true);
      const mockStatSync = vi.spyOn(fs, "statSync").mockImplementation(() => {
        throw new Error("Stat error");
      });

      const config = withComity({}) as UserConfig;
      const aliases = config.resolve?.alias as any[];
      const customResolver = aliases[0].customResolver;

      const result = customResolver("/path/to/file.js");

      expect(result).toBeNull();
    });
  });

  describe("regex pattern matching", () => {
    it("should match scoped package imports", () => {
      const config = withComity({}) as UserConfig;
      const aliases = config.resolve?.alias as any[];
      const pattern = aliases[0].find;

      expect(pattern.test("@scope/package")).toBe(true);
      expect(pattern.test("@scope/package/subpath")).toBe(true);
    });

    it("should match regular package imports", () => {
      const config = withComity({}) as UserConfig;
      const aliases = config.resolve?.alias as any[];
      const pattern = aliases[0].find;

      expect(pattern.test("package-name")).toBe(true);
      expect(pattern.test("package-name/subpath")).toBe(true);
    });

    it("should not match relative imports", () => {
      const config = withComity({}) as UserConfig;
      const aliases = config.resolve?.alias as any[];
      const pattern = aliases[0].find;

      // Relative paths starting with @ but not scoped packages
      expect(pattern.test("./local")).toBe(false);
      expect(pattern.test("../parent")).toBe(false);
    });
  });

  describe("options parameter", () => {
    it("should accept empty options object", () => {
      expect(() => withComity({})).not.toThrow();
    });

    it("should return consistent config regardless of options", () => {
      const config1 = withComity({});
      const config2 = withComity({});

      expect(config1).toEqual(config2);
    });
  });

  describe("return type", () => {
    it("should return synchronous config (not Promise)", () => {
      const result = withComity({});

      expect(result).not.toBeInstanceOf(Promise);
      expect(typeof result).toBe("object");
    });

    it("should be compatible with Vite defineConfig", () => {
      const config = withComity({}) as UserConfig;

      // Check for required Vite config properties
      expect(config).toHaveProperty("resolve");
      expect(typeof config.resolve).toBe("object");
    });
  });
});
