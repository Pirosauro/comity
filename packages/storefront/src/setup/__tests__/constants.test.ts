import { describe, expect, it } from "vitest";
import {
  CATEGORY_PAGE_COMPOSER_TOKEN,
  CONTENT_PAGE_COMPOSER_TOKEN,
  PRODUCT_PAGE_COMPOSER_TOKEN,
  SEARCH_PAGE_COMPOSER_TOKEN,
} from "../constants.js";

describe("storefront setup constants", () => {
  it("should expose composer tokens", () => {
    expect(CATEGORY_PAGE_COMPOSER_TOKEN.description).toBe("@comity/storefront:category-page");
    expect(CONTENT_PAGE_COMPOSER_TOKEN.description).toBe("@comity/storefront:content-page");
    expect(PRODUCT_PAGE_COMPOSER_TOKEN.description).toBe("@comity/storefront:product-page");
    expect(SEARCH_PAGE_COMPOSER_TOKEN.description).toBe("@comity/storefront:search-page");
  });

  it("should expose distinct tokens", () => {
    const tokens = [
      CATEGORY_PAGE_COMPOSER_TOKEN,
      CONTENT_PAGE_COMPOSER_TOKEN,
      PRODUCT_PAGE_COMPOSER_TOKEN,
      SEARCH_PAGE_COMPOSER_TOKEN,
    ];

    expect(new Set(tokens).size).toBe(tokens.length);
  });
});