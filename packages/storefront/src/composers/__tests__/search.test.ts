import type { ProductModel } from "@comity/catalog";
import type { SearchResultModel } from "@comity/search";
import type { SearchPageEnricher } from "../contracts/search-page.js";

import { describe, expect, it, vi } from "vitest";
import { success } from "@comity/primitives/result";
import { DefaultSearchPageComposer } from "../search.js";

const ctx = { locale: "en-US" };

const result: SearchResultModel<ProductModel> = {
  items: [{ id: "p-1", name: "T-Shirt", variants: [] }],
  total: 1,
  page: 1,
  pageSize: 20,
};

describe("DefaultSearchPageComposer", () => {
  it("should compose a search page from the repository result", async () => {
    const repository = { search: vi.fn().mockResolvedValue(success(result)) };
    const composer = new DefaultSearchPageComposer(repository as any);

    const composed = await composer.compose("t-shirt", ctx);

    expect(repository.search).toHaveBeenCalledWith({ query: "t-shirt" }, ctx);
    expect(composed.success).toBe(true);
    if (composed.success) {
      expect(composed.value).toMatchObject({
        type: "search",
        id: "search",
        url: "/search?q=t-shirt",
        title: "Search: t-shirt",
        query: "t-shirt",
        result,
      });
    }
  });

  it("should build the search url with encoding", async () => {
    const repository = { search: vi.fn().mockResolvedValue(success(result)) };
    const composer = new DefaultSearchPageComposer(repository as any);

    const composed = await composer.compose("blue shirt", ctx);

    expect(composed.success).toBe(true);
    if (composed.success) {
      expect(composed.value.url).toBe("/search?q=blue%20shirt");
    }
  });

  it("should use a default title for an empty query", async () => {
    const repository = { search: vi.fn().mockResolvedValue(success(result)) };
    const composer = new DefaultSearchPageComposer(repository as any);

    const composed = await composer.compose("", ctx);

    expect(composed.success).toBe(true);
    if (composed.success) {
      expect(composed.value.title).toBe("Search");
      expect(composed.value.url).toBe("/search?q=");
    }
  });

  it("should propagate a repository failure", async () => {
    const error = new Error("repo error");
    const repository = { search: vi.fn().mockResolvedValue({ success: false, error }) };
    const composer = new DefaultSearchPageComposer(repository as any);

    const composed = await composer.compose("t-shirt", ctx);

    expect(composed.success).toBe(false);
    expect(composed.error).toBe(error);
  });

  it("should apply enrichers and keep their result", async () => {
    const repository = { search: vi.fn().mockResolvedValue(success(result)) };
    const enrichers: SearchPageEnricher[] = [
      {
        enrich: vi.fn().mockImplementation(async (page) =>
          success({ ...page, breadcrumbs: [{ label: "Search", url: "/search" }] })
        ),
      },
    ];
    const composer = new DefaultSearchPageComposer(repository as any, enrichers);

    const composed = await composer.compose("t-shirt", ctx);

    expect(composed.success).toBe(true);
    if (composed.success) {
      expect(composed.value.breadcrumbs).toEqual([{ label: "Search", url: "/search" }]);
    }
  });

  it("should ignore enrichers that return a failure", async () => {
    const repository = { search: vi.fn().mockResolvedValue(success(result)) };
    const failingEnricher: SearchPageEnricher = {
      enrich: vi.fn().mockResolvedValue({ success: false, error: new Error("enrich") }),
    };
    const composer = new DefaultSearchPageComposer(repository as any, [failingEnricher]);

    const composed = await composer.compose("t-shirt", ctx);

    expect(composed.success).toBe(true);
    if (composed.success) {
      expect(composed.value).toMatchObject({ query: "t-shirt", title: "Search: t-shirt" });
    }
  });
});