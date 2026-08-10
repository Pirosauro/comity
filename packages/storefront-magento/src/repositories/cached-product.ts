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
   * Searches products with optional read-through cache for filter-only inputs.
   *
   * @param input - Search criteria; cached only when no textual query is present.
   * @param ctx - Optional catalog repository context.
   *
   * @returns Paginated product search result.
   */
  async search(
    input: SearchCriteriaModel,
    ctx?: CachedCatalogRepositoryContext
  ): Promise<Result<SearchResultModel<ProductModel>, RepositoryError>> {
    const repository = this.#repository;

    // Only cache filter-only searches. Searches that include a textual query
    // have unbounded cardinality and are not cached.
    if (input.query === undefined) {
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

      const result = await repository.search(input, ctx);

      if (result.success) {
        try {
          await cache.set(key, JSON.stringify(result.value), {
            ttl: 60 * 5,
          });
        } catch {}
      }

      return result;
    }

    return repository.search(input, ctx);
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
}
