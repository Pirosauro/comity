import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { withComity } from "../with-comity.js";
import * as fs from "node:fs";

// Mock fs module
vi.mock("node:fs", () => ({
  existsSync: vi.fn(),
  statSync: vi.fn(),
}));

// Mock process.cwd
const originalCwd = process.cwd;
beforeEach(() => {
  process.cwd = vi.fn().mockReturnValue("/test/project");
});

afterEach(() => {
  process.cwd = originalCwd;
  vi.restoreAllMocks();
});

describe("withComity", () => {
  const mockExistsSync = vi.mocked(fs.existsSync);
  const mockStatSync = vi.mocked(fs.statSync);

  beforeEach(() => {
    vi.clearAllMocks();
    mockExistsSync.mockReturnValue(true);
    mockStatSync.mockReturnValue({ isFile: () => true } as any);
  });

  describe("configuration generation", () => {
    it("should return a Vite UserConfig object", () => {
      const config = withComity({});

      expect(config).toBeDefined();
      expect(typeof config).toBe("object");
      expect(config).toHaveProperty("resolve");
    });

    it("should include resolve.alias configuration", () => {
      const config = withComity({});

      expect(config.resolve).toBeDefined();
      expect(config.resolve?.alias).toBeDefined();
      expect(Array.isArray(config.resolve?.alias)).toBe(true);
    });

    it("should configure alias with regex pattern", () => {
      const config = withComity({});

      const aliases = config.resolve?.alias as any[];
      expect(aliases).toHaveLength(1);
      expect(aliases[0]).toHaveProperty("find");
      expect(aliases[0].find).toBeInstanceOf(RegExp);
    });

    it("should configure alias replacement path", () => {
      const config = withComity({});

      const aliases = config.resolve?.alias as any[];
      expect(aliases[0]).toHaveProperty("replacement");
      expect(typeof aliases[0].replacement).toBe("string");
      expect(aliases[0].replacement).toContain("src/overrides");
    });

    it("should include customResolver function", () => {
      const config = withComity({});

      const aliases = config.resolve?.alias as any[];
      expect(aliases[0]).toHaveProperty("customResolver");
      expect(typeof aliases[0].customResolver).toBe("function");
    });
  });

  describe("customResolver behavior", () => {
    it("should return source path when file exists", () => {
      mockExistsSync.mockReturnValue(true);
      mockStatSync.mockReturnValue({ isFile: () => true } as any);

      const config = withComity({});
      const aliases = config.resolve?.alias as any[];
      const customResolver = aliases[0].customResolver;

      const result = customResolver("/path/to/override.js");

      expect(result).toBe("/path/to/override.js");
      expect(mockExistsSync).toHaveBeenCalledWith("/path/to/override.js");
      expect(mockStatSync).toHaveBeenCalledWith("/path/to/override.js");
    });

    it("should return null when file does not exist", () => {
      mockExistsSync.mockReturnValue(false);

      const config = withComity({});
      const aliases = config.resolve?.alias as any[];
      const customResolver = aliases[0].customResolver;

      const result = customResolver("/path/to/nonexistent.js");

      expect(result).toBeNull();
      expect(mockExistsSync).toHaveBeenCalledWith("/path/to/nonexistent.js");
    });

    it("should return null when path is a directory", () => {
      mockExistsSync.mockReturnValue(true);
      mockStatSync.mockReturnValue({ isFile: () => false } as any);

      const config = withComity({});
      const aliases = config.resolve?.alias as any[];
      const customResolver = aliases[0].customResolver;

      const result = customResolver("/path/to/directory");

      expect(result).toBeNull();
      expect(mockExistsSync).toHaveBeenCalledWith("/path/to/directory");
      expect(mockStatSync).toHaveBeenCalledWith("/path/to/directory");
    });

    it("should return null when fs operation throws error", () => {
      mockExistsSync.mockImplementation(() => {
        throw new Error("FS error");
      });

      const config = withComity({});
      const aliases = config.resolve?.alias as any[];
      const customResolver = aliases[0].customResolver;

      const result = customResolver("/path/to/file.js");

      expect(result).toBeNull();
      expect(mockExistsSync).toHaveBeenCalledWith("/path/to/file.js");
    });

    it("should handle statSync throwing error", () => {
      mockExistsSync.mockReturnValue(true);
      mockStatSync.mockImplementation(() => {
        throw new Error("Stat error");
      });

      const config = withComity({});
      const aliases = config.resolve?.alias as any[];
      const customResolver = aliases[0].customResolver;

      const result = customResolver("/path/to/file.js");

      expect(result).toBeNull();
      expect(mockExistsSync).toHaveBeenCalledWith("/path/to/file.js");
      expect(mockStatSync).toHaveBeenCalledWith("/path/to/file.js");
    });
  });

  describe("regex pattern matching", () => {
    it("should match scoped package imports", () => {
      const config = withComity({});
      const aliases = config.resolve?.alias as any[];
      const pattern = aliases[0].find;

      expect(pattern.test("@scope/package")).toBe(true);
      expect(pattern.test("@my-org/ui")).toBe(true);
    });

    it("should match regular package imports", () => {
      const config = withComity({});
      const aliases = config.resolve?.alias as any[];
      const pattern = aliases[0].find;

      expect(pattern.test("package-name")).toBe(true);
      expect(pattern.test("lodash")).toBe(true);
      expect(pattern.test("react-dom")).toBe(true);
    });

    it("should match packages with subpaths", () => {
      const config = withComity({});
      const aliases = config.resolve?.alias as any[];
      const pattern = aliases[0].find;

      expect(pattern.test("@scope/package/subpath")).toBe(true);
      expect(pattern.test("package-name/utils")).toBe(true);
    });

    it("should not match relative imports", () => {
      const config = withComity({});
      const aliases = config.resolve?.alias as any[];
      const pattern = aliases[0].find;

      expect(pattern.test("./local")).toBe(false);
      expect(pattern.test("../parent")).toBe(false);
      expect(pattern.test("@/alias/path")).toBe(false);
    });

    it("should not match absolute paths", () => {
      const config = withComity({});
      const aliases = config.resolve?.alias as any[];
      const pattern = aliases[0].find;

      expect(pattern.test("/absolute/path")).toBe(false);
      expect(pattern.test("C:\\windows\\path")).toBe(false);
    });
  });

  describe("options handling", () => {
    it("should accept empty options object", () => {
      const config = withComity({});

      expect(config).toBeDefined();
      expect(config.resolve?.alias).toHaveLength(1);
    });

    it("should return consistent config regardless of options", () => {
      const config1 = withComity({});
      const config2 = withComity({ baseFolder: "src" });

      expect(config1.resolve?.alias).toHaveLength(1);
      expect(config2.resolve?.alias).toHaveLength(1);
    });

    it("should return synchronous config (not Promise)", () => {
      const config = withComity({});

      expect(config).not.toBeInstanceOf(Promise);
      expect(typeof config).toBe("object");
    });
  });

  describe("allowedOverrides configuration", () => {
    it("should create specific aliases for allowed overrides", () => {
      const config = withComity({
        allowedOverrides: ["lodash", "@scope/package"],
      });

      const aliases = config.resolve?.alias as any[];
      expect(aliases).toHaveLength(2);

      // Check first alias
      expect(aliases[0].find).toBeInstanceOf(RegExp);
      expect(aliases[0].find.test("lodash")).toBe(true);
      expect(aliases[0].find.test("lodash/utils")).toBe(true);
      expect(aliases[0].find.test("other")).toBe(false);

      // Check second alias
      expect(aliases[1].find).toBeInstanceOf(RegExp);
      expect(aliases[1].find.test("@scope/package")).toBe(true);
      expect(aliases[1].find.test("@scope/package/sub")).toBe(true);
      expect(aliases[1].find.test("other")).toBe(false);
    });

    it("should handle empty allowedOverrides array", () => {
      const config = withComity({
        allowedOverrides: [],
      });

      const aliases = config.resolve?.alias as any[];
      expect(aliases).toHaveLength(0);
    });
  });

  describe("baseFolder configuration", () => {
    it("should use custom baseFolder in replacement path", () => {
      const config = withComity({
        baseFolder: "custom",
      });

      const aliases = config.resolve?.alias as any[];
      expect(aliases[0].replacement).toContain("custom/overrides");
    });

    it("should default to 'src' when baseFolder not specified", () => {
      const config = withComity({});

      const aliases = config.resolve?.alias as any[];
      expect(aliases[0].replacement).toContain("src/overrides");
    });
  });

  describe("path security", () => {
    it("should handle path traversal attempts safely", () => {
      // The customResolver should handle any path safely
      const config = withComity({});
      const aliases = config.resolve?.alias as any[];
      const customResolver = aliases[0].customResolver;

      // Even with malicious paths, it should not throw
      expect(() => customResolver("../../../etc/passwd")).toBeDefined();
      expect(() => customResolver("C:\\windows\\system32")).toBeDefined();
    });
  });

  describe("error handling", () => {
    it("should handle invalid baseFolder gracefully", () => {
      // Should not throw during config creation
      expect(() => withComity({ baseFolder: "" })).not.toThrow();
    });

    it("should handle undefined cwd", () => {
      const originalCwd = process.cwd;
      process.cwd = vi.fn().mockReturnValue(undefined as any);

      expect(() => withComity({})).toThrow();

      process.cwd = originalCwd;
    });
  });
});
