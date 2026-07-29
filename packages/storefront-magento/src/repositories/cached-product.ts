import type { CacheStore } from "@comity/cache";
import type { ProductModel, ProductRepository } from "@comity/catalog";
import type { RepositoryError } from "@comity/primitives/errors";
import type { Result } from "@comity/primitives/result";
import type { SearchCriteriaModel, SearchResultModel } from "@comity/search";
import type { CachedCatalogRepositoryContext } from "../contracts/cached-repository-context.js";

import { serializeCacheKey } from "@comity/cache";
import { success } from "@comity/primitives/result";

/**
 * Cache wrapper for Magento product repository.
 */
export class MagentoCachedProductRepository implements ProductRepository {
  #repository: ProductRepository;
  #cache: CacheStore;

  /**
   * @param repository - Underlying Magento product repository.
   * @param cache - Cache store used for read-through caching.
   */
  constructor(repository: ProductRepository, cache: CacheStore) {
    this.#repository = repository;
    this.#cache = cache;
  }

  /**
   * Lists products with read-through cache.
   *
   * @param input - Search criteria without query text.
   * @param ctx - Optional catalog repository context.
   *
   * @returns Paginated product search result.
   */
  async list(
    input: Omit<SearchCriteriaModel, "query">,
    ctx?: CachedCatalogRepositoryContext
  ): Promise<Result<SearchResultModel<ProductModel>, RepositoryError>> {
    const repository = this.#repository;
    const cache = this.#cache;
    const { tenant, scope } = ctx ?? {};
    const key = serializeCacheKey({
      product: { tenant, scope, input },
    });
    const cached = await cache.get(key);

    if (cached) {
      try {
        const parsed = JSON.parse(cached) as SearchResultModel<ProductModel>;

        return success(parsed, { cached: true });
      } catch {
        await cache.delete(key);
      }
    }

    const result = await repository.list(input, ctx);

    if (result.success) {
      try {
        await cache.set(key, JSON.stringify(result.value), {
          ttl: 60 * 5,
        });
      } catch {}
    }

    return result;
  }

  /**
   * Gets a product by identifier with read-through cache.
   *
   * @param id - Product identifier.
   * @param ctx - Optional catalog repository context.
   *
   * @returns Product model or null when not found.
   */
  async get(
    id: string,
    ctx?: CachedCatalogRepositoryContext
  ): Promise<Result<ProductModel | null, RepositoryError>> {
    const repository = this.#repository;
    const cache = this.#cache;
    const { tenant, scope } = ctx ?? {};
    const key = serializeCacheKey({ product: { tenant, scope, id } });
    const cached = await cache.get(key);

    if (cached) {
      try {
        const parsed = JSON.parse(cached) as ProductModel;

        return success(parsed, { cached: true });
      } catch {
        await cache.delete(key);
      }
    }

    const result = await repository.get(id, ctx);

    if (result.success && result.value) {
      try {
        await cache.set(key, JSON.stringify(result.value), {
          ttl: 60 * 5,
        });
      } catch {}
    }

    return result;
  }

  /**
   * Gets a product by slug with read-through cache.
   *
   * @param slug - Product URL slug.
   * @param ctx - Optional catalog repository context.
   *
   * @returns Product model or null when not found.
   */
  async getBySlug(
    slug: string,
    ctx?: CachedCatalogRepositoryContext
  ): Promise<Result<ProductModel | null, RepositoryError>> {
    const repository = this.#repository;
    const cache = this.#cache;
    const { tenant, scope } = ctx ?? {};
    const key = serializeCacheKey({ product: { tenant, scope, slug } });
    const cached = await cache.get(key);

    if (cached) {
      try {
        const parsed = JSON.parse(cached) as ProductModel;

        return success(parsed, { cached: true });
      } catch {
        await cache.delete(key);
      }
    }

    const result = await repository.getBySlug(slug, ctx);

    if (result.success && result.value) {
      try {
        await cache.set(key, JSON.stringify(result.value), {
          ttl: 60 * 5,
        });
      } catch {}
    }

    return result;
  }

  /**
   * @inheritdoc
   */
  async search(
    input: SearchCriteriaModel,
    ctx?: CachedCatalogRepositoryContext
  ): Promise<Result<SearchResultModel<ProductModel>, RepositoryError>> {
    // Caching search results can be complex due to the variety of possible queries and filters.
    // For simplicity, this implementation does not cache search results.
    return this.#repository.search(input, ctx);
  }
}
