import type { RepositoryError } from "@comity/primitives/errors";
import type { Result } from "@comity/primitives/result";
import type { SearchCriteriaModel, SearchResultModel } from "@comity/search";
import type { CatalogRepositoryContext } from "../contracts/repository-context.js";
import type { ProductProjection } from "../contracts/product.js";
import type { ProductRepository } from "../contracts/product-repository.js";

import { success } from "@comity/primitives/result";

/**
 * In-memory implementation of `ProductRepository` for testing and development purposes.
 *
 * Note: This implementation is not suitable for production use as it does not persist
 * products and is not shared across multiple instances of the application.
 */
export class MemoryProductRepository implements ProductRepository {
  /** */
  #products = new Map<string, ProductProjection>();

  /**
   * @inheritdoc
   */
  async getById(
    id: string,
    _ctx?: CatalogRepositoryContext
  ): Promise<Result<ProductProjection | null, RepositoryError>> {
    const product = this.#products.get(id);

    if (!product) {
      return success(null);
    }

    return success(product);
  }

  /**
   * @inheritdoc
   */
  async getBySlug(
    slug: string,
    _ctx?: CatalogRepositoryContext
  ): Promise<Result<ProductProjection | null, RepositoryError>> {
    const product = [...this.#products.values()].find((p) => p.slug === slug);

    if (!product) {
      return success(null);
    }

    return success(product);
  }

  /**
   * @inheritdoc
   */
  async search(
    criteria?: SearchCriteriaModel,
    _ctx?: CatalogRepositoryContext
  ): Promise<Result<SearchResultModel<ProductProjection>, RepositoryError>> {
    const all = [...this.#products.values()];
    let filtered = all;

    if (criteria?.query !== undefined && criteria.query.length > 0) {
      const query = criteria.query.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description?.toLowerCase().includes(query) ||
          p.slug?.toLowerCase().includes(query) ||
          p.type?.toLowerCase().includes(query) ||
          p.tags?.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    if (criteria?.filters !== undefined && criteria.filters.length > 0) {
      for (const filter of criteria.filters) {
        filtered = filtered.filter((product) => this.#matchesFilter(product, filter));
      }
    }

    const page = criteria?.pagination?.page ?? 1;
    const pageSize = criteria?.pagination?.pageSize ?? filtered.length;
    const offset = (page - 1) * pageSize;
    const items = filtered.slice(offset, offset + pageSize);

    const total = filtered.length;

    return success({
      items,
      total,
      page,
      pageSize,
      aggregations: [],
    });
  }

  /**
   * Adds a product to the in-memory store for testing.
   * Not part of the ProductRepository contract.
   */
  add(product: ProductProjection): void {
    this.#products.set(product.id, product);
  }

  /**
   * Clears all products from the in-memory store.
   * Not part of the ProductRepository contract.
   */
  clear(): void {
    this.#products.clear();
  }

  /**
   * Checks if a product matches a filter criterion.
   */
  #matchesFilter(product: ProductProjection, filter: import("@comity/search").SearchCriteriaFilter): boolean {
    const value = this.#getProductFieldValue(product, filter.field);

    if (value === undefined) {
      return false;
    }

    if (filter.eq !== undefined) {
      return value === filter.eq;
    }

    if (filter.in !== undefined) {
      return filter.in.includes(value);
    }

    if (typeof value === "number") {
      if (filter.min !== undefined && value < filter.min) {
        return false;
      }
      if (filter.max !== undefined && value > filter.max) {
        return false;
      }
      return true;
    }

    return true;
  }

  /**
   * Gets a field value from a product for filtering.
   */
  #getProductFieldValue(product: ProductProjection, field: string): string | number | boolean | undefined {
    switch (field) {
      case "id":
        return product.id;
      case "name":
        return product.name;
      case "slug":
        return product.slug;
      case "status":
        return product.status;
      case "type":
        return product.type;
      case "categoryId":
        return product.categoryId;
      case "tags":
        return product.tags?.join(",");
      default:
        return undefined;
    }
  }
}