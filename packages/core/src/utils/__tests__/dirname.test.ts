import { describe, it, expect } from "vitest";
import { getDirname } from "../dirname.js";

describe("getDirname", () => {
  it("should return the directory of the current file in test environment", async () => {
    const result = await getDirname();

    expect(typeof result).toBe("string");
    expect(result).toMatch(/utils$/);
  });

  it("should return a string", async () => {
    const result = await getDirname();

    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });
});
