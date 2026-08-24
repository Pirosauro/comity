import { isFailure, isSuccess } from "@comity/primitives/result";

import { describe, expect, it } from "vitest";
import { createProduct } from "../create-product.js";

describe("createProduct", () => {
  it("should create a product with default draft status", () => {
    const result = createProduct({ id: "p-1", name: "T-Shirt" });

    expect(isSuccess(result)).toBe(true);
    if (isSuccess(result)) {
      expect(result.value).toMatchObject({
        id: "p-1",
        name: "T-Shirt",
        status: "draft",
      });
    }
  });

  it("should preserve an explicit status", () => {
    const result = createProduct({ id: "p-1", name: "T-Shirt", status: "active" });

    expect(isSuccess(result)).toBe(true);
    if (isSuccess(result)) {
      expect(result.value.status).toBe("active");
    }
  });

  it("should fail when the id is empty or whitespace-only", () => {
    const result = createProduct({ id: "   ", name: "T-Shirt" });

    expect(isFailure(result)).toBe(true);
    if (isFailure(result)) {
      expect(result.error.code).toBe("catalog:invalid_product");
      expect(result.error.meta.details).toMatchObject({ field: "id" });
    }
  });

  it("should fail when the name is empty", () => {
    const result = createProduct({ id: "p-1", name: "" });

    expect(isFailure(result)).toBe(true);
    if (isFailure(result)) {
      expect(result.error.code).toBe("catalog:invalid_product");
      expect(result.error.meta.details).toMatchObject({ field: "name" });
    }
  });

  it("should carry product definition metadata", () => {
    const result = createProduct({
      id: "p-1",
      name: "T-Shirt",
      type: "physical",
      categoryId: "c-1",
      tags: ["new", "summer"],
      brand: { id: "b-1", name: "Acme" },
    });

    expect(isSuccess(result)).toBe(true);
    if (isSuccess(result)) {
      expect(result.value).toMatchObject({
        type: "physical",
        categoryId: "c-1",
        tags: ["new", "summer"],
        brand: { id: "b-1", name: "Acme" },
      });
    }
  });

  it("should carry variants with option selections", () => {
    const result = createProduct({
      id: "p-1",
      name: "T-Shirt",
      variants: [
        {
          id: "v-1",
          sku: "TS-M",
          options: [{ code: "size", value: "M" }],
        },
      ],
    });

    expect(isSuccess(result)).toBe(true);
    if (isSuccess(result)) {
      expect(result.value.variants).toEqual([
        { id: "v-1", sku: "TS-M", options: [{ code: "size", value: "M" }] },
      ]);
    }
  });
});