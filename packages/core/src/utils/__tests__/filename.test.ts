import { describe, it, expect } from "vitest";
import { getFilename } from "../filename.js";

describe("getFilename", () => {
  it("should return the path of the current file in test environment", async () => {
    const result = await getFilename();

    expect(typeof result).toBe("string");
    expect(result).toMatch(/filename\.ts$/);
  });

  it("should return a string or undefined", async () => {
    const result = await getFilename();

    expect(typeof result === "string" || result === undefined).toBe(true);
    if (result) {
      expect(result.length).toBeGreaterThan(0);
    }
  });
});
