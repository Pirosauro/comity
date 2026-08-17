import { describe, expect, it } from "vitest";
import { CATEGORY_REPOSITORY_TOKEN, PRODUCT_REPOSITORY_TOKEN } from "../constants.js";

describe("catalog setup constants", () => {
  it("should expose product and category repository tokens", () => {
    expect(PRODUCT_REPOSITORY_TOKEN.description).toBe("@comity/catalog:product-repository");
    expect(CATEGORY_REPOSITORY_TOKEN.description).toBe("@comity/catalog:category-repository");
  });

  it("should expose distinct tokens", () => {
    expect(PRODUCT_REPOSITORY_TOKEN).not.toBe(CATEGORY_REPOSITORY_TOKEN);
  });
});