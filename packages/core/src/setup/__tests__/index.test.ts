import { describe, it, expect } from "vitest";
import module from "../index.js";
import { moduleMetaSchema } from "../../validation/module-meta.js";

describe("setup module", () => {
  it("should export valid module metadata", () => {
    expect(() => moduleMetaSchema.parse(module)).not.toThrow();
  });

  it("should have correct name and version", () => {
    expect(module.name).toBe("@comity/core");
    expect(module.version).toBe("1.0.0");
  });

  it("should have empty dependencies", () => {
    expect(module.dependsOn).toEqual([]);
    expect(module.optionalDependsOn).toEqual([]);
    expect(module.incompatibleWith).toEqual([]);
  });
});
