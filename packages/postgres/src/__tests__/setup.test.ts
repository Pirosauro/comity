import { describe, it, expect } from "vitest";
import { setup } from "../setup.js";

describe("Database Setup Module", () => {
  it("should have correct module metadata", () => {
    expect(setup.name).toBe("@comity/postgres");
    expect(setup.version).toBe("1.0.0");
    expect(setup.dependsOn).toEqual(["@comity/core"]);
    expect(setup.incompatibleWith).toEqual([]);
  });

  it("should export setup function", () => {
    expect(typeof setup.setup).toBe("function");
  });

  it("should return async function when setup is called", async () => {
    const options = {};
    const setupFunction = await setup.setup(options);

    expect(typeof setupFunction).toBe("function");
  });

  it("should handle empty options", async () => {
    const setupFunction = await setup.setup({});

    expect(typeof setupFunction).toBe("function");
  });

  it("should handle undefined options", async () => {
    const setupFunction = await setup.setup(undefined);

    expect(typeof setupFunction).toBe("function");
  });
});
