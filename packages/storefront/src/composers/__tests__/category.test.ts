import type { CategoryModel } from "@comity/taxonomy";
import type { CategoryPageEnricher } from "../contracts/category-page.js";

import { describe, expect, it, vi } from "vitest";
import { success } from "@comity/primitives/result";
import { DefaultCategoryPageComposer } from "../category.js";

const ctx = { locale: "en-US", currency: "USD" };

const category: CategoryModel = {
  id: "c-1",
  name: "Apparel",
  url: "/categories/apparel",
};

describe("DefaultCategoryPageComposer", () => {
  it("should compose a category page from the repository result", async () => {
    const repository = { getById: vi.fn().mockResolvedValue(success(category)) };
    const composer = new DefaultCategoryPageComposer(repository as any);

    const result = await composer.compose("c-1", ctx);

    expect(repository.getById).toHaveBeenCalledWith("c-1", ctx);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.value).toMatchObject({
        type: "category",
        id: "c-1",
        url: "/categories/apparel",
        title: "Apparel",
        category,
        products: [],
      });
    }
  });

  it("should propagate a repository failure", async () => {
    const error = new Error("repo error");
    const repository = { getById: vi.fn().mockResolvedValue({ success: false, error }) };
    const composer = new DefaultCategoryPageComposer(repository as any);

    const result = await composer.compose("c-1", ctx);

    expect(result.success).toBe(false);
    expect(result.error).toBe(error);
  });

  it("should use fallbacks when the category has no id, url or name", async () => {
    const repository = {
      getById: vi
        .fn()
        .mockResolvedValue(success({ ...category, id: undefined, url: undefined, name: undefined })),
    };
    const composer = new DefaultCategoryPageComposer(repository as any);

    const result = await composer.compose("c-1", ctx);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.value).toMatchObject({ id: "", url: "", title: "" });
    }
  });

  it("should apply enrichers and keep their result", async () => {
    const repository = { getById: vi.fn().mockResolvedValue(success(category)) };
    const enrichers: CategoryPageEnricher[] = [
      {
        enrich: vi.fn().mockImplementation(async (page) =>
          success({ ...page, products: [{ id: "p-1", name: "T-Shirt", variants: [] }] })
        ),
      },
    ];
    const composer = new DefaultCategoryPageComposer(repository as any, enrichers);

    const result = await composer.compose("c-1", ctx);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.value.products).toEqual([{ id: "p-1", name: "T-Shirt", variants: [] }]);
    }
  });

  it("should ignore enrichers that return a failure", async () => {
    const repository = { getById: vi.fn().mockResolvedValue(success(category)) };
    const failingEnricher: CategoryPageEnricher = {
      enrich: vi.fn().mockResolvedValue({ success: false, error: new Error("enrich") }),
    };
    const composer = new DefaultCategoryPageComposer(repository as any, [failingEnricher]);

    const result = await composer.compose("c-1", ctx);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.value).toMatchObject({ id: "c-1", title: "Apparel" });
    }
  });
});