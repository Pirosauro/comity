import { describe, it, expect } from "vitest";
import { VERSION } from "../constant.js";

describe("constant", () => {
  it("should export VERSION constant", () => {
    expect(VERSION).toBeDefined();
    expect(typeof VERSION).toBe("string");
    expect(VERSION).toBe("1.0.0");
  });
});
