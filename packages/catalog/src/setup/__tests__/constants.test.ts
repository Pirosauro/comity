import { describe, expect, it } from "vitest";
import { BRAND_REPOSITORY_TOKEN, PRODUCT_REPOSITORY_TOKEN } from "../constants.js";

describe("catalog setup constants", () => {
  it("should expose product and brand repository tokens", () => {
    expect(PRODUCT_REPOSITORY_TOKEN.description).toBe("@comity/catalog:product-repository");
    expect(BRAND_REPOSITORY_TOKEN.description).toBe("@comity/catalog:brand-repository");
  });

  it("should expose distinct tokens", () => {
    expect(PRODUCT_REPOSITORY_TOKEN).not.toBe(BRAND_REPOSITORY_TOKEN);
  });
});