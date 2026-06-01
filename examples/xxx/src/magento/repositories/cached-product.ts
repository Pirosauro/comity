import type { CacheStore } from "@comity/cache";
import type { GraphqlClientError } from "@comity/graphql-client/error";
import type { Result } from "@comity/primitives/result";
import type {
  ProductListModel,
  ProductModel,
  ProductRepository,
  ProductRepositoryFilter,
  ProductRepositoryOptions,
} from "../../features/catalog/repositories/product.js";
import type { GraphqlProductRepository } from "./product.js";

import { serializeCacheKey } from "@comity/cache";
import { success } from "@comity/primitives/result";

/**
 * The `GraphqlProductRepository` class is an implementation of the `ProductRepository` interface that uses a GraphQL client to fetch product data from a GraphQL API. This repository provides methods to retrieve product information based on unique identifiers, allowing other parts of the application to access and manipulate product data as needed. The class encapsulates the logic for constructing and sending GraphQL queries, handling responses, and returning structured product data to the caller.
 */
export class CachedProductRepository implements ProductRepository {
  /** */
  #repository: GraphqlProductRepository;

  /** */
  #cache: CacheStore;

  /**
   * @param repository - An instance of the `GraphqlProductRepository` that will be used to execute GraphQL queries and mutations related to product data. This repository provides methods for sending requests to a GraphQL server and handling responses, allowing the repository to interact with the backend API to fetch and manipulate product data.
   * @param cache - An instance of the `CacheStore` that will be used to cache product data. This allows the repository to store and retrieve product data from the cache, improving performance and reducing the number of requests to the GraphQL server.
   */
  constructor(repository: GraphqlProductRepository, cache: CacheStore) {
    this.#repository = repository;
    this.#cache = cache;
  }

  /**
   * @inheritdoc
   */
  async getList(
    input: ProductRepositoryFilter,
    options: ProductRepositoryOptions
  ): Promise<Result<ProductListModel, GraphqlClientError>> {
    const repository = this.#repository;
    const cache = this.#cache;
    const store = repository.store ?? "default";
    const key = serializeCacheKey({ product: { store, scope: options.scope, filter: input } });
    const cached = await cache.get(key);

    // If cached data is available, return it immediately
    if (cached) {
      try {
        const parsed = JSON.parse(cached) as ProductListModel;

        return success(parsed, { cached: true });
      } catch (cause) {
        // Invalidate the cache if the data is corrupted
        await cache.delete(key);
      }
    }

    // If no cached data is available, fetch from the repository
    const result = await this.#repository.getList(input, options);

    // Cache the result if the fetch was successful
    if (result.success) {
      const value = result.value;

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
  async getById(
    id: string,
    options: ProductRepositoryOptions
  ): Promise<Result<ProductModel | null, GraphqlClientError>> {
    const repository = this.#repository;
    const cache = this.#cache;
    const store = repository.store ?? "default";
    const key = serializeCacheKey({ product: { store, scope: options.scope, id } });
    const cached = await cache.get(key);

    // If cached data is available, return it immediately
    if (cached) {
      try {
        const parsed = JSON.parse(cached) as ProductModel;

        return success(parsed, { cached: true });
      } catch (cause) {
        // Invalidate the cache if the data is corrupted
        await cache.delete(key);
      }
    }

    // If no cached data is available, fetch from the repository
    const result = await repository.getById(id, options);

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
    options: ProductRepositoryOptions
  ): Promise<Result<ProductModel | null, GraphqlClientError>> {
    const repository = this.#repository;
    const cache = this.#cache;
    const store = repository.store ?? "default";
    const key = serializeCacheKey({ product: { store, scope: options.scope, slug } });
    const cached = await cache.get(key);

    // If cached data is available, return it immediately
    if (cached) {
      try {
        const parsed = JSON.parse(cached) as ProductModel;

        return success(parsed, { cached: true });
      } catch (cause) {
        // Invalidate the cache if the data is corrupted
        await cache.delete(key);
      }
    }

    // If no cached data is available, fetch from the repository
    const result = await repository.getBySlug(slug, options);

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
}
