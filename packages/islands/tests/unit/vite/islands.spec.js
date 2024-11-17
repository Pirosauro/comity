import { describe, jest, expect, it } from "@jest/globals";

jest.mock("fdir", () => {
  return {
    fdir: jest.fn().mockImplementation(() => {}),
  };
});

const { fdir } = await import("fdir");
const { comityIslands } = await import("../../../dist/vite/islands.js");

describe("comityIslands", () => {
  const mockOptions = { framework: "react", css: true };
  let plugin;

  beforeEach(async () => {
    fdir.mockImplementation(() => ({
      withRelativePaths: jest.fn().mockReturnThis(),
      withMaxDepth: jest.fn().mockReturnThis(),
      crawl: jest.fn().mockReturnThis(),
      sync: jest.fn().mockReturnValue(["component.tsx", "component.css"]),
    }));

    plugin = comityIslands(mockOptions);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should have the correct name", () => {
    expect(plugin.name).toBe("@comity/vite-islands");
  });

  it("should resolve virtual module id", () => {
    const resolvedId = plugin.resolveId?.("virtual:comity-islands");

    expect(resolvedId).toBe("\0virtual:comity-islands");
  });

  it("should load virtual module with components", () => {
    const code = plugin.load?.("\0virtual:comity-islands");

    expect(code).toContain("import('~/components/component.css');");
    expect(code).toContain(
      "'1v70cgr': () => import('~/components/component.tsx'),"
    );
  });

  it("should transform code for island components", () => {
    const inputCode = "const Component = () => {};";
    const id = "/src/components/test.island.tsx";
    const result = plugin.transform?.(inputCode, id);

    expect(result?.code).toContain(
      "Object.defineProperty(Test, 'name', { writable: false, value: 's1kdt' })"
    );
    expect(result?.code).toContain(
      "Object.defineProperty(Test, 'framework', { writable: false, value: 'react' })"
    );
  });
});
