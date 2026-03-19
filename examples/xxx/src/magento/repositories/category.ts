import type { GraphqlNode } from "@comity/graphql-builder";
import type { GraphqlClient } from "@comity/graphql-client";
import { failure, success, type Result } from "@comity/primitives/result";
import type { CategoryListViewModel } from "../../view-models/category-list.js";
import type { CategoryViewModel } from "../../view-models/category.js";
import type {
  CategoriesQueryInput,
  CategoriesResponse,
  CategoryNode,
} from "../graphql/category.js";

import { buildQuery, graphqlVar } from "@comity/graphql-builder";
import { GraphqlClientError } from "@comity/graphql-client/error";
import { CategoriesQueryInputSchema } from "../graphql/category.js";
import { normalizeToInt } from "../normalize.js";

/**
 *
 */
export interface CategoryRepositoryOptions {
  /** Optional store ID to fetch category data for a specific store view. */
}

/**
 *
 */
export interface CategoryRepositoryQueryOptions {
  /** Optional store ID to fetch category data for a specific store view. */
  store?: string;

  /** Optional list of fields to fetch for the category. */
  fields?: Omit<GraphqlNode<CategoriesResponse>, "$args">;
}

/**
 *
 */
export interface CategoryRepositoryGetOptions extends CategoryRepositoryQueryOptions {}

/**
 *
 */
export interface CategoryRepositoryListOptions extends CategoryRepositoryQueryOptions {}

/**
 *
 */
export interface CategoryRepository {
  /**
   *
   */
  list(
    input: CategoriesQueryInput,
    options?: CategoryRepositoryListOptions
  ): Promise<Result<CategoryListViewModel>>;

  /**
   * Fetches a category tree by its unique identifier (UID). This method sends a GraphQL query to the server, requesting the category tree data associated with the provided UID. The response is expected to include details about the category, such as its name, description, URL, and any child categories it may have. The method returns the category tree data in a structured format that can be used by other parts of the application to display or manipulate the category information.
   *
   * @param uid - The unique identifier of the category tree to be fetched. This UID is typically a string that corresponds to the category's unique key in the database or backend system. It is used to specify which category tree should be retrieved from the server.
   * @param options - Optional parameters for fetching the category tree, such as store ID.
   *
   * @returns A promise that resolves to the category tree data associated with the provided UID. The data includes various properties of the category, such as its name, description, URL, and relationships to other categories. If the category tree is not found or if there is an error during the fetch operation, the promise may reject with an appropriate error message.
   */
  getByUid(
    uid: string,
    options?: CategoryRepositoryGetOptions
  ): Promise<Result<CategoryViewModel | null, GraphqlClientError>>;
}

/**
 * The `GraphqlCategoryRepository` class is an implementation of the `CategoryTreeRepository` interface that uses a GraphQL client to fetch category tree data from a GraphQL API. This repository provides methods to retrieve category tree information based on unique identifiers, allowing other parts of the application to access and manipulate category data as needed. The class encapsulates the logic for constructing and sending GraphQL queries, handling responses, and returning structured category tree data to the caller.
 */
export class GraphqlCategoryRepository implements CategoryRepository {
  /** */
  #graphql: GraphqlClient;

  /**
   * @param graphql - An instance of the `GraphqlClient` that will be used to execute GraphQL queries and mutations related to category trees. This client provides methods for sending requests to a GraphQL server and handling responses, allowing the repository to interact with the backend API to fetch and manipulate category tree data.
   */
  constructor(graphql: GraphqlClient) {
    this.#graphql = graphql;
  }

  /**
   * @inheritdoc
   */
  async list(
    input: CategoriesQueryInput,
    options?: CategoryRepositoryListOptions
  ): Promise<Result<CategoryListViewModel, GraphqlClientError>> {
    try {
      const result = await this.#query("ListCategories", input, options);

      return success({
        items: result.data?.categories.items.map(this.#toCommon) ?? [],
        totalCount: result.data?.categories.total_count ?? 0,
        pageInfo: {
          currentPage: result.data?.categories.page_info.current_page ?? 1,
          pageSize: result.data?.categories.page_info.page_size ?? 20,
          totalPages: result.data?.categories.page_info.total_pages ?? 1,
        },
      });
    } catch (cause) {
      if (cause instanceof GraphqlClientError) {
        return failure(cause);
      }

      return failure(
        new GraphqlClientError("protocol_error", {
          details: {
            operationName: "ListCategories",
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
  async getByUid(
    uid: string,
    options?: CategoryRepositoryGetOptions
  ): Promise<Result<CategoryViewModel | null, GraphqlClientError>> {
    try {
      const input: CategoriesQueryInput = {
        filters: {
          category_uid: {
            eq: uid,
          },
        },
        pageSize: 1,
        currentPage: 1,
      };

      const result = await this.#query("GetCategoryByUid", input, options);
      const node = result.data?.categories.items[0];

      if (!node) {
        return success(null);
      }

      return success(this.#toCommon(node));
    } catch (cause) {
      if (cause instanceof GraphqlClientError) {
        return failure(cause);
      }

      return failure(
        new GraphqlClientError("protocol_error", {
          details: {
            operationName: "GetCategoryByUid",
          },
          cause,
          context: {
            uid,
          },
        })
      );
    }
  }

  /**
   * Fetches a category tree by its unique identifier (UID). This method sends a GraphQL query to the server, requesting the category tree data associated with the provided UID. The response is expected to include details about the category, such as its name, description, URL, and any child categories it may have. The method returns the category tree data in a structured format that can be used by other parts of the application to display or manipulate the category information.
   *
   * @param name - The name of the GraphQL query operation to be executed. This name is used for logging, debugging, and error handling purposes, allowing developers to identify which specific query is being executed when analyzing logs or handling errors.
   * @param input - The input parameters for fetching the category tree, including filters and pagination options. This input is validated against the `CategoriesQueryInputSchema` to ensure that it meets the expected structure and constraints before being used in the GraphQL query.
   * @param options - Optional parameters for fetching the category tree, such as store ID and fields to select. These options allow the caller to customize the query and specify which fields should be included in the response, as well as any additional headers that may be needed for the request.
   *
   * @returns A promise that resolves to the category tree data associated with the provided UID. The data includes various properties of the category, such as its name, description, URL, and relationships to other categories. If the category tree is not found or if there is an error during the fetch operation, the promise may reject with an appropriate error message.
   */
  async #query(
    name: string,
    input: CategoriesQueryInput,
    options?: CategoryRepositoryQueryOptions
  ) {
    const validated = CategoriesQueryInputSchema.parse(input);
    const query = buildQuery<CategoriesResponse>(
      {
        $type: "query",
        $name: name,
        $vars: {
          $filters: "CategoryFilterInput",
          $currentPage: "Int",
          $pageSize: "Int",
        },
        categories: {
          $args: {
            filters: graphqlVar("filters"),
            currentPage: graphqlVar("currentPage"),
            pageSize: graphqlVar("pageSize"),
          },
          items: {
            ...(options?.fields ?? {}),
            uid: true,
            name: true,
            url_key: true,
            url_suffix: true,
            canonical_url: true,
          },
          page_info: {
            current_page: true,
            page_size: true,
            total_pages: true,
          },
          total_count: true,
        },
      },
      { indent: false }
    );

    // Execute the GraphQL query using the client and handle the response, including error handling and data transformation to fit the `CategoryListViewModel` structure expected by the application.
    const result = await this.#graphql.query<CategoriesResponse>({
      query,
      variables: validated,
      operationName: name,
      headers: options?.store ? { store: options.store } : {},
    });

    if (result.errors?.length) {
      throw new GraphqlClientError("protocol_error", {
        details: {
          operationName: name,
          errors: result.errors,
        },
        context: {
          input,
        },
      });
    }

    return result;
  }

  /**
   * Converts the raw category tree data retrieved from the GraphQL API into a common `CategoryViewModel` format that can be used by other parts of the application. This method takes the `CategoryNode` as input and maps its properties to the corresponding fields in the `CategoryViewModel`, ensuring that the data is structured in a way that is consistent with the application's view layer. The method handles any necessary transformations, such as normalizing numeric values or constructing URLs, to ensure that the resulting `CategoryViewModel` is ready for use in the presentation layer.
   *
   * @param data - The raw category tree data retrieved from the GraphQL API, represented as a `CategoryNode` object. This data includes various properties of the category, such as its name, description, URL components, and counts of products and child categories.
   *
   * @returns A `CategoryViewModel` object that contains the mapped and normalized category data, ready for use in the presentation layer of the application. The view model includes properties such as `name`, `description`, `image`, `url`, `slug`, `productCount`, and `childrenCount`, which are derived from the corresponding fields in the input data.
   */
  #toCommon(data: CategoryNode): CategoryViewModel {
    return {
      name: data.name ?? "Unknown Category",
      url: data.canonical_url ?? `${data.url_key ?? ""}${data.url_suffix ?? ""}`,
      slug: `${data.url_key ?? ""}${data.url_suffix ?? ""}`,
      ...(data.description ? { description: data.description } : {}),
      ...(data.image ? { image: data.image } : {}),
      ...(data.product_count ? { productCount: normalizeToInt(data.product_count) } : {}),
      ...(data.children_count ? { childrenCount: normalizeToInt(data.children_count) } : {}),
      meta: {
        title: data.meta_title ?? data.name ?? "Unknown Category",
        ...(data.meta_description ? { description: data.meta_description } : {}),
        ...(data.meta_keywords ? { keywords: data.meta_keywords } : {}),
      },
    };
  }
}
