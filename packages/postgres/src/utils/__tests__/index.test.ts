import { describe, it, expect } from "vitest";
import * as utilsModule from "../index.js";

describe("utils/index.ts exports", () => {
  it("should export performHealthCheck", () => {
    expect(utilsModule).toHaveProperty("performHealthCheck");
    expect(typeof utilsModule.performHealthCheck).toBe("function");
  });

  it("should export testConnection", () => {
    expect(utilsModule).toHaveProperty("testConnection");
    expect(typeof utilsModule.testConnection).toBe("function");
  });
});

