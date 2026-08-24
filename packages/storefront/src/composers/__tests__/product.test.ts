import type { ProductProjection } from "@comity/catalog";
import type { ProductPageEnricher } from "../contracts/product-page.js";

import { describe, expect, it, vi } from "vitest";
import { success } from "@comity/primitives/result";
import { DefaultProductPageComposer } from "../product.js";

const ctx = { locale: "en-US", currency: "USD" };

const product: ProductProjection = {
  id: "p-1",
  name: "T-Shirt",
  url: "/products/t-shirt",
  status: "active",
  variants: [],
};

describe("DefaultProductPageComposer", () => {
  it("should compose a product page from the repository result", async () => {
    const repository = { getById: vi.fn().mockResolvedValue(success(product)) };
    const composer = new DefaultProductPageComposer(repository as any);

    const result = await composer.compose("p-1", ctx);

    expect(repository.getById).toHaveBeenCalledWith("p-1", ctx);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.value).toMatchObject({
        type: "product",
        id: "p-1",
        url: "/products/t-shirt",
        title: "T-Shirt",
        product,
      });
    }
  });

  it("should use fallbacks when the product has no id, url or name", async () => {
    const repository = {
      getById: vi.fn().mockResolvedValue(success({ ...product, id: undefined, url: undefined, name: undefined })),
    };
    const composer = new DefaultProductPageComposer(repository as any);

    const result = await composer.compose("p-1", ctx);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.value).toMatchObject({ id: "", url: "", title: "" });
    }
  });

  it("should propagate a repository failure", async () => {
    const error = new Error("repo error");
    const repository = { getById: vi.fn().mockResolvedValue({ success: false, error }) };
    const composer = new DefaultProductPageComposer(repository as any);

    const result = await composer.compose("p-1", ctx);

    expect(result.success).toBe(false);
    expect(result.error).toBe(error);
  });

  it("should apply enrichers in order", async () => {
    const repository = { getById: vi.fn().mockResolvedValue(success(product)) };
    const enrichers: ProductPageEnricher[] = [
      {
        enrich: vi.fn().mockImplementation(async (page) =>
          success({ ...page, breadcrumbs: [{ label: "Home", url: "/" }] })
        ),
      },
    ];
    const composer = new DefaultProductPageComposer(repository as any, enrichers);

    const result = await composer.compose("p-1", ctx);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.value.breadcrumbs).toEqual([{ label: "Home", url: "/" }]);
    }
  });

  it("should ignore enrichers that return a failure", async () => {
    const repository = { getById: vi.fn().mockResolvedValue(success(product)) };
    const failingEnricher: ProductPageEnricher = {
      enrich: vi.fn().mockResolvedValue({ success: false, error: new Error("enrich") }),
    };
    const composer = new DefaultProductPageComposer(repository as any, [failingEnricher]);

    const result = await composer.compose("p-1", ctx);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.value).toMatchObject({ id: "p-1", title: "T-Shirt" });
    }
  });
});