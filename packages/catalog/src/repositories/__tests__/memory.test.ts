import { beforeEach, describe, expect, it } from "vitest";
import { isFailure, isSuccess } from "@comity/primitives/result";
import { MemoryProductRepository } from "../memory.js";
import type { ProductProjection, ProductStatus } from "../../contracts/product.js";
import type { SearchCriteriaModel } from "@comity/search";

let productIdCounter = 0;

function makeProduct(overrides: Partial<ProductProjection> = {}): ProductProjection {
  return {
    id: `prod-${++productIdCounter}`,
    name: "Test Product",
    slug: "test-product",
    status: "active",
    ...overrides,
  };
}

describe("MemoryProductRepository", () => {
  let repository: MemoryProductRepository;

  beforeEach(() => {
    repository = new MemoryProductRepository();
  });

  it("returns null when no product exists", async () => {
    const result = await repository.getById("missing");

    expect(result).toEqual({ success: true, value: null });
  });

  it("returns a product saved by id", async () => {
    const product = makeProduct({ id: "prod-1", name: "Test Product" });
    repository.add(product);

    const result = await repository.getById("prod-1");

    expect(result.success).toBe(true);
    expect(result.value?.id).toBe("prod-1");
    expect(result.value?.name).toBe("Test Product");
  });

  it("returns null for a different id", async () => {
    repository.add(makeProduct({ id: "prod-1" }));

    const result = await repository.getById("prod-2");

    expect(result).toEqual({ success: true, value: null });
  });

  it("returns a product by slug", async () => {
    const product = makeProduct({ slug: "test-product" });
    repository.add(product);

    const result = await repository.getBySlug("test-product");

    expect(result.success).toBe(true);
    expect(result.value?.slug).toBe("test-product");
  });

  it("returns null for a different slug", async () => {
    repository.add(makeProduct({ slug: "test-product" }));

    const result = await repository.getBySlug("other-product");

    expect(result).toEqual({ success: true, value: null });
  });

  it("search returns all products when no criteria", async () => {
    repository.add(makeProduct({ id: "prod-1", name: "Product A" }));
    repository.add(makeProduct({ id: "prod-2", name: "Product B" }));

    const result = await repository.search();

    expect(result.success).toBe(true);
    expect(result.value?.total).toBe(2);
    expect(result.value?.items).toHaveLength(2);
  });

  it("search filters by query text", async () => {
    repository.add(makeProduct({ name: "Apple iPhone" }));
    repository.add(makeProduct({ name: "Samsung Galaxy" }));

    const result = await repository.search({ query: "Apple" });

    expect(result.success).toBe(true);
    expect(result.value?.total).toBe(1);
    expect(result.value?.items[0]?.name).toBe("Apple iPhone");
  });

  it("search filters by status", async () => {
    repository.add(makeProduct({ id: "prod-1", status: "active" }));
    repository.add(makeProduct({ id: "prod-2", status: "draft" }));

    const criteria: SearchCriteriaModel = {
      filters: [{ field: "status", eq: "active" }],
    };

    const result = await repository.search(criteria);

    expect(result.success).toBe(true);
    expect(result.value?.total).toBe(1);
    expect(result.value?.items[0]?.status).toBe("active");
  });

  it("search respects pagination", async () => {
    repository.add(makeProduct({ id: "prod-1", name: "Product A" }));
    repository.add(makeProduct({ id: "prod-2", name: "Product B" }));
    repository.add(makeProduct({ id: "prod-3", name: "Product C" }));

    const result = await repository.search({ pagination: { page: 1, pageSize: 1 } });

    expect(result.success).toBe(true);
    expect(result.value?.total).toBe(3);
    expect(result.value?.items).toHaveLength(1);
    expect(result.value?.page).toBe(1);
    expect(result.value?.pageSize).toBe(1);
  });

  it("search respects page offset", async () => {
    repository.add(makeProduct({ id: "prod-1", name: "Product A" }));
    repository.add(makeProduct({ id: "prod-2", name: "Product B" }));
    repository.add(makeProduct({ id: "prod-3", name: "Product C" }));

    const result = await repository.search({ pagination: { page: 2, pageSize: 1 } });

    expect(result.success).toBe(true);
    expect(result.value?.total).toBe(3);
    expect(result.value?.items).toHaveLength(1);
    expect(result.value?.page).toBe(2);
    expect(result.value?.items[0]?.name).toBe("Product B");
  });

  it("search combines query and filters", async () => {
    repository.add(makeProduct({ name: "Apple iPhone", status: "active" }));
    repository.add(makeProduct({ name: "Apple Watch", status: "draft" }));
    repository.add(makeProduct({ name: "Samsung Galaxy", status: "active" }));

    const criteria = {
      query: "Apple",
      filters: [{ field: "status", eq: "active" }],
    };

    const result = await repository.search(criteria);

    expect(result.success).toBe(true);
    expect(result.value?.total).toBe(1);
    expect(result.value?.items[0]?.name).toBe("Apple iPhone");
  });

  it("returns empty result when no matches", async () => {
    repository.add(makeProduct({ name: "Apple" }));

    const result = await repository.search({ query: "Banana" });

    expect(result.success).toBe(true);
    expect(result.value?.total).toBe(0);
    expect(result.value?.items).toHaveLength(0);
  });

  it("add and clear utility methods work", async () => {
    repository.add(makeProduct({ id: "prod-1" }));
    expect((await repository.getById("prod-1")).value).not.toBeNull();

    repository.clear();
    expect((await repository.getById("prod-1")).value).toBeNull();
  });
});