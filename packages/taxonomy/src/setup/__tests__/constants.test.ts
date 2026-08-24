import { describe, expect, it } from "vitest";
import { TAXONOMY_REPOSITORY_TOKEN } from "../constants.js";

describe("taxonomy setup constants", () => {
  it("should expose the taxonomy repository token", () => {
    expect(TAXONOMY_REPOSITORY_TOKEN.description).toBe(
      "@comity/taxonomy:taxonomy-repository"
    );
  });
});