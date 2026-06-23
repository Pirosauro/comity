import type { CacheStore } from "@comity/cache";
import type { CategoryModel, CategoryRepository } from "@comity/catalog";
import type { RepositoryError } from "@comity/primitives/error";
import type { Result } from "@comity/primitives/result";
import type { SearchCriteriaModel, SearchResultModel } from "@comity/search";
import type { CachedCatalogRepositoryContext } from "../contracts/cached-repository-context.js";
import type { MagentoGraphqlCategoryRepository } from "./category.js";

import { serializeCacheKey } from "@comity/cache";
import { success } from "@comity/primitives/result";

/**
 * The `MagentoCachedCategoryRepository` class is an implementation of the `CategoryTreeRepository` interface that uses a GraphQL client to fetch category tree data from a GraphQL API. This repository provides methods to retrieve category tree information based on unique identifiers, allowing other parts of the application to access and manipulate category data as needed. The class encapsulates the logic for constructing and sending GraphQL queries, handling responses, and returning structured category tree data to the caller.
 */
export class MagentoCachedCategoryRepository implements CategoryRepository {
  /** */
  #repository: MagentoGraphqlCategoryRepository;

  /** */
  #cache: CacheStore;

  /**
   * @param repository - An instance of the `MagentoGraphqlCategoryRepository` that will be used to execute GraphQL queries and mutations related to category trees. This repository provides methods for sending requests to a GraphQL server and handling responses, allowing the repository to interact with the backend API to fetch and manipulate category tree data.
   * @param cache - An instance of the `CacheStore` that will be used to cache category tree data. This allows the repository to store and retrieve category data from the cache, improving performance and reducing the number of requests to the GraphQL server.
   */
  constructor(repository: MagentoGraphqlCategoryRepository, cache: CacheStore) {
    this.#repository = repository;
    this.#cache = cache;
  }

  /**
   * @inheritdoc
   */
  async list(
    input: Omit<SearchCriteriaModel, "query">,
    ctx?: CachedCatalogRepositoryContext
  ): Promise<Result<SearchResultModel<CategoryModel>, RepositoryError>> {
    const cache = this.#cache;
    const { tenant, scope } = ctx ?? {};
    const key = serializeCacheKey({ category: { tenant, scope, input } });
    const cached = await cache.get(key);

    // If cached data is available, return it immediately
    if (cached) {
      try {
        const parsed = JSON.parse(cached) as SearchResultModel<CategoryModel>;

        return success(parsed, { cached: true });
      } catch (cause) {
        // Invalidate the cache if the data is corrupted
        await cache.delete(key);
      }
    }

    // If no cached data is available, fetch from the repository
    const result = await this.#repository.list(input, ctx);

    // Cache the result if the fetch was successful
    if (result.success) {
      try {
        await cache.set(key, JSON.stringify(result.value), {
          ttl: 60 * 5, // Cache for 5 minutes
        });
      } catch (cause) {}
    }

    return result;
  }

  /**
   * @inheritdoc
   */
  async get(
    id: string,
    ctx?: CachedCatalogRepositoryContext
  ): Promise<Result<CategoryModel | null, RepositoryError>> {
    const cache = this.#cache;
    const { tenant, scope } = ctx ?? {};
    const key = serializeCacheKey({ category: { tenant, scope, id } });
    const cached = await cache.get(key);

    // If cached data is available, return it immediately
    if (cached) {
      try {
        const parsed = JSON.parse(cached) as CategoryModel;

        return success(parsed, { cached: true });
      } catch (cause) {
        // Invalidate the cache if the data is corrupted
        await cache.delete(key);
      }
    }

    // If no cached data is available, fetch from the repository
    const result = await this.#repository.get(id, ctx);

    // Cache the result if the fetch was successful
    if (result.success && result.value) {
      try {
        await cache.set(key, JSON.stringify(result.value), {
          ttl: 60 * 5, // Cache for 5 minutes
        });
      } catch (cause) {}
    }

    return result;
  }

  /**
   * @inheritdoc
   */
  async getBySlug(
    slug: string,
    ctx?: CachedCatalogRepositoryContext
  ): Promise<Result<CategoryModel | null, RepositoryError>> {
    const cache = this.#cache;
    const { tenant, scope } = ctx ?? {};
    const key = serializeCacheKey({ category: { tenant, scope, slug } });
    const cached = await cache.get(key);

    // If cached data is available, return it immediately
    if (cached) {
      try {
        const parsed = JSON.parse(cached) as CategoryModel;

        return success(parsed, { cached: true });
      } catch (cause) {
        // Invalidate the cache if the data is corrupted
        await cache.delete(key);
      }
    }

    // If no cached data is available, fetch from the repository
    const result = await this.#repository.getBySlug(slug, ctx);

    // Cache the result if the fetch was successful
    if (result.success && result.value) {
      try {
        await cache.set(key, JSON.stringify(result.value), {
          ttl: 60 * 5, // Cache for 5 minutes
        });
      } catch (cause) {}
    }

    return result;
  }

  /**
   * @inheritdoc
   */
  async search(
    input: SearchCriteriaModel,
    ctx?: CachedCatalogRepositoryContext
  ): Promise<Result<SearchResultModel<CategoryModel>, RepositoryError>> {
    // For simplicity, we are not caching search results in this implementation.
    // Caching search results can be complex due to the variability of search queries and results.

    return await this.#repository.search(input, ctx);
  }
}
