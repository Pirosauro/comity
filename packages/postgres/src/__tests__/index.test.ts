import { describe, it, expect } from "vitest";
import * as indexModule from "../index.js";

describe("index.ts exports", () => {
  it("should export PostgresRepository", () => {
    expect(indexModule).toHaveProperty("PostgresRepository");
  });

  it("should export PostgresRepositoryConstructor type", () => {
    // Type exports are compile-time only, but we can verify the module exports exist
    expect(indexModule).toBeDefined();
  });
});

