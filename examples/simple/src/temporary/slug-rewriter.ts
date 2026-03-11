import type { UrlRewriter } from "@comity/router";

export const slugRewriter: UrlRewriter = {
  /** @inheritdoc */
  rewrite(url, http) {
    const slug = url.pathname.slice(1);

    if (!slug) return null;

    if (slug === "iphone-15") {
      return new URL("/catalog/product/view/id/1", url);
    }

    return null;
  },
};
