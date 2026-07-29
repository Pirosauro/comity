import type { CatalogRepositoryContext, CategoryModel, CategoryRepository } from "@comity/catalog";
import type { GraphqlClient } from "@comity/graphql-client";
import type { Result } from "@comity/primitives/result";
import type { SearchCriteriaModel, SearchResultModel } from "@comity/search";
import type { MagentoCategory } from "../internal/graphql/category.js";
import type { MagentoGraphqlCategoryQueryInput } from "../internal/schema/queries/category.js";

import { RepositoryError } from "@comity/primitives/errors";
import { failure, success } from "@comity/primitives/result";
import { toMagentoFilter } from "../internal/filters/magento.js";
import { buildCategoryQuery } from "../internal/graphql/category.js";
import { toCategoryModel } from "../internal/mappers/category.js";

/**
 * The `MagentoGraphqlCategoryRepository` class is an implementation of the `CategoryRepository` interface that uses a GraphQL client to fetch category data from a GraphQL API. This repository provides methods to retrieve category information based on unique identifiers, allowing other parts of the application to access and manipulate category data as needed. The class encapsulates the logic for constructing and sending GraphQL queries, handling responses, and returning structured category data to the caller.
 */
export class MagentoGraphqlCategoryRepository implements CategoryRepository {
  /** */
  #graphql: GraphqlClient;

  /**
   * @param graphql - An instance of the `GraphqlClient` that will be used to execute GraphQL queries and mutations related to categories. This client provides methods for sending requests to a GraphQL server and handling responses, allowing the repository to interact with the backend API to fetch and manipulate category data.
   */
  constructor(graphql: GraphqlClient) {
    this.#graphql = graphql;
  }

  /**
   * @inheritdoc
   */
  async search(
    input: SearchCriteriaModel,
    ctx?: CatalogRepositoryContext
  ): Promise<Result<SearchResultModel<CategoryModel>, RepositoryError>> {
    try {
      const filters = toMagentoFilter(input.filters);
      const result = await this.buildQuery(
        "SearchCategories",
        {
          filters,
          currentPage: input.pagination?.page ?? 1,
          pageSize: input.pagination?.pageSize ?? 20,
        },
        ctx
      );

      return success({
        items: result.data?.categories?.items?.map(this.toModel) ?? [],
        total: result.data?.categories?.total_count ?? 0,
        page: result.data?.categories?.page_info?.current_page ?? 1,
        pageSize: result.data?.categories?.page_info?.page_size ?? 20,
      });
    } catch (cause) {
      return failure(
        new RepositoryError("service_unavailable", {
          details: {
            repository: "MagentoGraphqlCategoryRepository",
            operation: "SearchCategories",
          },
          cause,
          context: {
            input,
          },
        })
      );
    }
  }

  /**
   * @inheritdoc
   */
  async list(
    input: Omit<SearchCriteriaModel, "query">,
    ctx?: CatalogRepositoryContext
  ): Promise<Result<SearchResultModel<CategoryModel>, RepositoryError>> {
    try {
      const filters = toMagentoFilter(input.filters);
      const result = await this.buildQuery(
        "ListCategories",
        {
          filters,
          currentPage: input.pagination?.page ?? 1,
          pageSize: input.pagination?.pageSize ?? 20,
        },
        ctx
      );

      return success({
        items: result.data?.categories?.items?.map(this.toModel) ?? [],
        total: result.data?.categories?.total_count ?? 0,
        page: result.data?.categories?.page_info?.current_page ?? 1,
        pageSize: result.data?.categories?.page_info?.page_size ?? 20,
      });
    } catch (cause) {
      return failure(
        new RepositoryError("service_unavailable", {
          details: {
            repository: "MagentoGraphqlCategoryRepository",
            operation: "ListCategories",
          },
          cause,
          context: {
            input,
          },
        })
      );
    }
  }

  /**
   * @inheritdoc
   */
  async get(
    id: string,
    ctx?: CatalogRepositoryContext
  ): Promise<Result<CategoryModel | null, RepositoryError>> {
    try {
      const input: MagentoGraphqlCategoryQueryInput = {
        filters: {
          category_uid: {
            eq: id,
          },
        },
        pageSize: 1,
        currentPage: 1,
      };

      const result = await this.buildQuery("GetCategoryById", input, ctx);
      const node = result.data?.categories?.items?.[0];

      if (!node) {
        return success(null);
      }

      return success(this.toModel(node));
    } catch (cause) {
      return failure(
        new RepositoryError("service_unavailable", {
          details: {
            repository: "MagentoGraphqlCategoryRepository",
            operation: "GetCategoryById",
          },
          cause,
          context: {
            id,
          },
        })
      );
    }
  }

  /**
   * @inheritdoc
   */
  async getBySlug(
    slug: string,
    ctx?: CatalogRepositoryContext
  ): Promise<Result<CategoryModel | null, RepositoryError>> {
    try {
      const input: MagentoGraphqlCategoryQueryInput = {
        filters: {
          url_key: {
            eq: slug,
          },
        },
        pageSize: 1,
        currentPage: 1,
      };

      const result = await this.buildQuery("GetCategoryBySlug", input, ctx);
      const node = result.data?.categories?.items?.[0];

      if (!node) {
        return success(null);
      }

      return success(this.toModel(node));
    } catch (cause) {
      return failure(
        new RepositoryError("service_unavailable", {
          details: {
            repository: "MagentoGraphqlCategoryRepository",
            operation: "GetCategoryBySlug",
          },
          cause,
          context: {
            slug,
          },
        })
      );
    }
  }

  /**
   * Fetches a category tree by its unique identifier (ID). This method sends a GraphQL query to the server, requesting the category tree data associated with the provided ID. The response is expected to include details about the category, such as its name, description, URL, and any child categories it may have. The method returns the category tree data in a structured format that can be used by other parts of the application to display or manipulate the category information.
   *
   * @param name - The name of the GraphQL query operation to be executed. This name is used for logging, debugging, and error handling purposes, allowing developers to identify which specific query is being executed when analyzing logs or handling errors.
   * @param input - The input parameters for fetching the category tree, including filters and pagination options. This input is validated against the `MagentoGraphqlCategoryQueryInputSchema` to ensure that it meets the expected structure and constraints before being used in the GraphQL query.
   * @param ctx - Optional context for the repository request, including fields selection, locale, currency, and tenant information. This context can be used to customize the behavior of the query execution, such as selecting specific fields to include in the response or providing tenant-specific information for multi-tenant applications.
   *
   * @returns A promise that resolves to the category tree data associated with the provided ID. The data includes various properties of the category, such as its name, description, URL, and relationships to other categories. If the category tree is not found or if there is an error during the fetch operation, the promise may reject with an appropriate error message.
   */
  protected buildQuery(
    name: string,
    input: MagentoGraphqlCategoryQueryInput,
    ctx?: CatalogRepositoryContext
  ) {
    return buildCategoryQuery(this.#graphql, name, input, ctx);
  }

  /**
   * Transforms the raw category tree data received from the GraphQL API into a structured `CategoryModel` that can be used by other parts of the application. This method takes the raw data, which may include various properties and relationships, and maps it to the defined structure of the `CategoryModel`, ensuring that the data is consistent and usable within the application's domain logic. The transformation may involve renaming fields, converting data types, and organizing nested relationships to fit the expected format of the `CategoryModel`.
   *
   * @param data - The raw category tree data received from the GraphQL API, which may include various properties such as the category's name, description, URL, and relationships to other categories. This data is typically in a format that closely matches the structure of the GraphQL response and may require transformation to fit the application's domain model.
   *
   * @returns A `CategoryModel` object that represents the category data in a structured format, with properties and relationships organized according to the application's domain model. This model can be used by other parts of the application to display category information, manage category relationships, and perform other operations related to categories.
   */
  protected toModel(data: MagentoCategory): CategoryModel {
    return toCategoryModel(data);
  }
}
