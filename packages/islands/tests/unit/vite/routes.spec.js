import { describe, jest, expect, it } from "@jest/globals";
import { resolve } from "node:path";
import { afterEach } from "node:test";

jest.mock("fdir", () => {
  return {
    fdir: jest.fn().mockImplementation(() => {}),
  };
});

const { fdir } = await import("fdir");
const { getRoutes, comityRoutes } = await import(
  "../../../dist/vite/routes.js"
);

describe("getRoutes", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should group and sort files correctly", () => {
    const mockFiles = [
      "folder1/file1.ts",
      "folder1/file2.ts",
      "folder2/file1.ts",
      "folder2/file2.ts",
      "folder2/subfolder/file3.ts",
      "folder3/[param].ts",
      "folder3/index.ts",
    ];

    fdir.mockImplementation(() => ({
      withRelativePaths: jest.fn().mockReturnThis(),
      withMaxDepth: jest.fn().mockReturnThis(),
      crawl: jest.fn().mockReturnThis(),
      sync: jest.fn().mockReturnValue(mockFiles),
    }));

    const result = getRoutes("some/path");

    expect(result).toEqual([
      "folder2/subfolder/file3.ts",
      "folder1/file1.ts",
      "folder1/file2.ts",
      "folder2/file1.ts",
      "folder2/file2.ts",
      "folder3/index.ts",
      "folder3/[param].ts",
    ]);
  });

  it("should handle empty directories", () => {
    const mockFiles = [];

    fdir.mockImplementation(() => ({
      withRelativePaths: jest.fn().mockReturnThis(),
      withMaxDepth: jest.fn().mockReturnThis(),
      crawl: jest.fn().mockReturnThis(),
      sync: jest.fn().mockReturnValue(mockFiles),
    }));

    const result = getRoutes("some/path");

    expect(result).toEqual([]);
  });
});

describe("comityRoutes", () => {
  beforeEach(() => {
    fdir.mockImplementation(() => ({
      withRelativePaths: jest.fn().mockReturnThis(),
      withMaxDepth: jest.fn().mockReturnThis(),
      crawl: jest.fn().mockReturnThis(),
      sync: jest.fn().mockReturnValue(["index.ts", "about.ts", "blog/[id].ts"]),
    }));
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should return a Vite plugin with the correct name", () => {
    const originalConsoleLog = console.log;
    console.log = jest.fn();

    const plugin = comityRoutes();

    expect(plugin.name).toBe("@comity/vite-routes");
    console.log = originalConsoleLog;
  });

  it("should resolve virtual module id correctly", () => {
    const originalConsoleLog = console.log;
    console.log = jest.fn();

    const plugin = comityRoutes();
    const resolved = plugin.resolveId("virtual:comity-routes/about.ts");

    expect(resolved).toEqual({
      id: resolve("./src/views/about.ts"),
      external: false,
      moduleSideEffects: true,
    });
    console.log = originalConsoleLog;
  });

  it("should load the virtual module correctly", async () => {
    const plugin = comityRoutes();
    const code = await plugin.load("\0virtual:comity-routes");

    expect(code).toContain(
      "import r0 from 'virtual:comity-routes/blog/[id].ts'"
    );
    expect(code).toContain("import r1 from 'virtual:comity-routes/about.ts'");
    expect(code).toContain("import r2 from 'virtual:comity-routes/index.ts'");
    expect(code).toContain("'/blog/[id]': r0,");
    expect(code).toContain("'/about': r1,");
    expect(code).toContain("'/': r2,");
  });

  it("should log the correct number of routes", () => {
    const consoleSpy = jest.spyOn(console, "log");

    comityRoutes();

    expect(consoleSpy).toHaveBeenCalledWith(
      "\u001B[34m3 routes found\u001B[0m"
    );

    consoleSpy.mockRestore();
  });
});
