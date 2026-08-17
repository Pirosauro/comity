import { describe, expect, it } from "vitest";
import { BLOCK_REPOSITORY_TOKEN, PAGE_REPOSITORY_TOKEN } from "../constants.js";

describe("content setup constants", () => {
  it("should expose page and block repository tokens", () => {
    expect(PAGE_REPOSITORY_TOKEN.description).toBe("@comity/content:page-repository");
    expect(BLOCK_REPOSITORY_TOKEN.description).toBe("@comity/content:block-repository");
  });

  it("should expose distinct tokens", () => {
    expect(PAGE_REPOSITORY_TOKEN).not.toBe(BLOCK_REPOSITORY_TOKEN);
  });
});