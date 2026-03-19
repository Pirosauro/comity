import type { CacheStore } from "@comity/cache";
import type { GraphqlClientError } from "@comity/graphql-client/error";
import type { Result } from "@comity/primitives/result";
import type { CategoryListViewModel } from "../../view-models/category-list.js";
import type { CategoryViewModel } from "../../view-models/category.js";
import type { CategoriesQueryInput } from "../graphql/category.js";
import type {
  CategoryRepository,
  CategoryRepositoryGetOptions,
  CategoryRepositoryListOptions,
  GraphqlCategoryRepository,
} from "./category.js";

import { success } from "@comity/primitives/result";

/**
 * The `GraphqlCategoryRepository` class is an implementation of the `CategoryTreeRepository` interface that uses a GraphQL client to fetch category tree data from a GraphQL API. This repository provides methods to retrieve category tree information based on unique identifiers, allowing other parts of the application to access and manipulate category data as needed. The class encapsulates the logic for constructing and sending GraphQL queries, handling responses, and returning structured category tree data to the caller.
 */
export class CachedCategoryRepository implements CategoryRepository {
  /** */
  #repository: GraphqlCategoryRepository;

  /** */
  #cache: CacheStore;

  /**
   * @param repository - An instance of the `GraphqlCategoryRepository` that will be used to execute GraphQL queries and mutations related to category trees. This repository provides methods for sending requests to a GraphQL server and handling responses, allowing the repository to interact with the backend API to fetch and manipulate category tree data.
   * @param cache - An instance of the `CacheStore` that will be used to cache category tree data. This allows the repository to store and retrieve category data from the cache, improving performance and reducing the number of requests to the GraphQL server.
   */
  constructor(repository: GraphqlCategoryRepository, cache: CacheStore) {
    this.#repository = repository;
    this.#cache = cache;
  }

  /**
   * @inheritdoc
   */
  async list(
    input: CategoriesQueryInput,
    options?: CategoryRepositoryListOptions
  ): Promise<Result<CategoryListViewModel, GraphqlClientError>> {
    // Todo
    return this.#repository.list(input, options);
  }

  /**
   * @inheritdoc
   */
  async getByUid(
    uid: string,
    options?: CategoryRepositoryGetOptions
  ): Promise<Result<CategoryViewModel | null, GraphqlClientError>> {
    const repository = this.#repository;
    const cache = this.#cache;
    const store = options?.store ?? "default";
    const cached = await cache.get(`category:${store}:${uid}`);

    // If cached data is available, return it immediately
    if (cached) {
      try {
        const parsed = JSON.parse(cached) as CategoryViewModel;

        return success(parsed);
      } catch (cause) {
        // Invalidate the cache if the data is corrupted
        await cache.delete(`category:${store}:${uid}`);
      }
    }

    // If no cached data is available, fetch from the repository
    const result = await repository.getByUid(uid, options);

    // Cache the result if the fetch was successful
    if (result.success && result.value) {
      try {
        await cache.set(`category:${store}:${uid}`, JSON.stringify(result.value), {
          ttl: 60 * 5, // Cache for 5 minutes
        });
      } catch (cause) {}
    }

    return result;
  }
}
