import type { GraphqlFieldsSelector } from "@comity/graphql-builder";
import type { GraphqlClient } from "@comity/graphql-client";
import type { Result } from "@comity/primitives/result";
import type { CategoriesQuery, CategoryTree } from "typed-magento-graphql";
import type { CategoriesQueryInput } from "typed-magento-graphql/schemas";
import type {
  CategoryListModel,
  CategoryModel,
  CategoryRepository,
  CategoryRepositoryFilter,
  CategoryRepositoryOptions,
} from "../../features/catalog/repositories/category.js";
import type { Image, Seo } from "../../features/catalog/repositories/types.js";

import { buildQuery, graphqlVar } from "@comity/graphql-builder";
import { GraphqlClientError } from "@comity/graphql-client/error";
import { failure, success } from "@comity/primitives/result";
import { CategoriesQueryInputSchema } from "typed-magento-graphql/schemas";
import { FieldMapper, ValueMapper } from "../internal/mapper.js";
import { normalizeToInt } from "../internal/normalize.js";

/**
 * Optional query options for fetching category data, allowing callers to specify additional parameters such as store view or fields selection when retrieving category information from the repository. These options can be used to customize the behavior of the repository methods and tailor the data retrieval to specific use cases or requirements.
 */
export interface GraphqlCategoryRepositoryOptions {
  /** Optional store ID to fetch category data for a specific store view. */
  store?: string;

  /** Optional user token for authentication or authorization purposes. */
  token?: string;
}

/**
 * The `GraphqlCategoryRepository` class is an implementation of the `CategoryRepository` interface that uses a GraphQL client to fetch category data from a GraphQL API. This repository provides methods to retrieve category information based on unique identifiers, allowing other parts of the application to access and manipulate category data as needed. The class encapsulates the logic for constructing and sending GraphQL queries, handling responses, and returning structured category data to the caller.
 */
export class GraphqlCategoryRepository implements CategoryRepository {
  /** */
  #graphql: GraphqlClient;

  /** Optional repository options for customizing the behavior of the GraphqlCategoryRepository instance. */
  #options: GraphqlCategoryRepositoryOptions;

  /**
   * @param graphql - An instance of the `GraphqlClient` that will be used to execute GraphQL queries and mutations related to categories. This client provides methods for sending requests to a GraphQL server and handling responses, allowing the repository to interact with the backend API to fetch and manipulate category data.
   * @param options - Optional parameters for configuring the behavior of the repository, such as store view and fields selection. These options allow the caller to customize the queries sent to the GraphQL API and specify which fields should be included in the response, as well as any additional headers that may be needed for the requests.
   */
  constructor(graphql: GraphqlClient, options?: GraphqlCategoryRepositoryOptions) {
    this.#graphql = graphql;
    this.#options = options ?? {};
  }

  /**
   * Gets the store ID from the repository options, which can be used to specify the store view for fetching category data.
   *
   * @returns The store ID from the repository options.
   */
  get store() {
    return this.#options.store;
  }

  /**
   * @inheritdoc
   */
  async getList(
    input: CategoryRepositoryFilter,
    options: CategoryRepositoryOptions
  ): Promise<Result<CategoryListModel, GraphqlClientError>> {
    try {
      const filters = input.id
        ? { category_uid: Array.isArray(input.id) ? { in: input.id } : { eq: input.id } }
        : input.parentId
          ? {
              parent_id: Array.isArray(input.parentId)
                ? { in: input.parentId }
                : { eq: input.parentId },
            }
          : input.slug
            ? { url_key: Array.isArray(input.slug) ? { in: input.slug } : { eq: input.slug } }
            : undefined;
      const result = await this.#query(
        "ListCategories",
        {
          filters,
          currentPage: input.currentPage ?? 1,
          pageSize: input.pageSize ?? 20,
        },
        options
      );

      return success({
        items: result.data?.categories?.items?.map(this.#toModel) ?? [],
        total: result.data?.categories?.total_count ?? 0,
        currentPage: result.data?.categories?.page_info?.current_page ?? 1,
        pageSize: result.data?.categories?.page_info?.page_size ?? 20,
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
  async getById(
    id: string,
    options: CategoryRepositoryOptions
  ): Promise<Result<CategoryModel | null, GraphqlClientError>> {
    try {
      const input: CategoriesQueryInput = {
        filters: {
          category_uid: {
            eq: id,
          },
        },
        pageSize: 1,
        currentPage: 1,
      };

      const result = await this.#query("GetCategoryById", input, options);
      const node = result.data?.categories?.items?.[0];

      if (!node) {
        return success(null);
      }

      return success(this.#toModel(node));
    } catch (cause) {
      if (cause instanceof GraphqlClientError) {
        return failure(cause);
      }

      return failure(
        new GraphqlClientError("protocol_error", {
          details: {
            operationName: "GetCategoryById",
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
    options: CategoryRepositoryOptions
  ): Promise<Result<CategoryModel | null, GraphqlClientError>> {
    try {
      const input: CategoriesQueryInput = {
        filters: {
          url_key: {
            eq: slug,
          },
        },
        pageSize: 1,
        currentPage: 1,
      };

      const result = await this.#query("GetCategoryBySlug", input, options);
      const node = result.data?.categories?.items?.[0];

      if (!node) {
        return success(null);
      }

      return success(this.#toModel(node));
    } catch (cause) {
      if (cause instanceof GraphqlClientError) {
        return failure(cause);
      }

      return failure(
        new GraphqlClientError("protocol_error", {
          details: {
            operationName: "GetCategoryBySlug",
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
   * @param input - The input parameters for fetching the category tree, including filters and pagination options. This input is validated against the `CategoriesQueryInputSchema` to ensure that it meets the expected structure and constraints before being used in the GraphQL query.
   * @param options - Optional query options that can be used to customize the behavior of the query, such as selecting specific fields to be included in the response. These options allow callers to tailor the data retrieval to their specific needs, optimizing performance by fetching only the necessary fields and reducing the amount of data transferred over the network.
   *
   * @returns A promise that resolves to the category tree data associated with the provided ID. The data includes various properties of the category, such as its name, description, URL, and relationships to other categories. If the category tree is not found or if there is an error during the fetch operation, the promise may reject with an appropriate error message.
   */
  async #query(name: string, input: CategoriesQueryInput, options: CategoryRepositoryOptions) {
    const store = this.#options.store;
    const validated = CategoriesQueryInputSchema.parse(input);
    const fields = this.#toCategoryTree(options.fields ?? {});
    const query = buildQuery<CategoriesQuery>(
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
            ...(fields ?? {}),
            uid: true,
            name: true,
            url_key: true,
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
    const result = await this.#graphql.query<CategoriesQuery>({
      query,
      variables: validated as Record<string, unknown>,
      operationName: name,
      headers: store ? { store } : {},
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
   * Converts the raw category tree data retrieved from the GraphQL API into a common `CategoryViewModel` format that can be used by other parts of the application. This method takes the `CategoryTree` as input and maps its properties to the corresponding fields in the `CategoryViewModel`, ensuring that the data is structured in a way that is consistent with the application's view layer. The method handles any necessary transformations, such as normalizing numeric values or constructing URLs, to ensure that the resulting `CategoryViewModel` is ready for use in the presentation layer.
   *
   * @param data - The raw category tree data retrieved from the GraphQL API, represented as a `CategoryTree` object. This data includes various properties of the category, such as its name, description, URL components, and counts of products and child categories.
   *
   * @returns A `CategoryModel` object that contains the mapped and normalized category data, ready for use in the presentation layer of the application. The view model includes properties such as `name`, `description`, `image`, `url`, `slug`, `productCount`, and `childrenCount`, which are derived from the corresponding fields in the input data.
   */
  #toModel(data: CategoryTree): CategoryModel {
    return (
      new ValueMapper<CategoryTree, CategoryModel>()
        // Mapping semplici
        .copy("uid", "id")
        .copy("name", "name")
        .copy("description", "description")
        .copy("url_key", "slug")

        // URL: combina url_path + url_suffix
        .add("url", (data) => {
          if (!data.url_path) return undefined;
          return `${data.url_path}${data.url_suffix ?? ""}`;
        })

        // Image
        .transform("image", "image", (img) => (img ? { url: img } : undefined))

        // Product count
        .transform("product_count", "productCount", (count) => normalizeToInt(count))

        // Children count
        .transform("children_count", "childrenCount", (count) => normalizeToInt(count))

        // SEO con merge
        .add("seo", (data) => ({
          title: data.meta_title ?? data.name!,
          ...(data.meta_description && { description: data.meta_description }),
          ...(data.meta_keywords && { keywords: data.meta_keywords }),
          ...(data.canonical_url && { canonical: data.canonical_url }),
        }))

        .map(data)
    );
  }

  /**
   * Converts the current `CategoryModel` instance into a `CategoryTree` object, optionally selecting specific fields to include in the output. This method is useful for transforming the view model into a format that can be used by other parts of the application or sent to external systems.
   *
   * @param fields - Optional fields selector that specifies which fields should be included in the resulting `CategoryTree` object. This allows for selective inclusion of properties, optimizing data transfer and processing by including only the necessary fields.
   *
   * @returns A `CategoryTree` object that represents the category data in a structured format, with properties corresponding to the fields defined in the `CategoryModel`. The output is tailored based on the provided fields selector, ensuring that only the specified fields are included in the resulting object.
   */
  #toCategoryTree(
    fields: GraphqlFieldsSelector<CategoryModel>
  ): GraphqlFieldsSelector<CategoryTree> {
    return (
      new FieldMapper<GraphqlFieldsSelector<CategoryModel>, GraphqlFieldsSelector<CategoryTree>>()
        .copy("id", "uid")
        .same("name")
        .same("description")
        .copy("slug", "url_key")
        .add("url_suffix", (f) => f.slug === true)

        // Image
        .sub("image", "image", (img) => (img as GraphqlFieldsSelector<Image>).url === true)

        // SEO mapping
        .sub("seo", "meta_title", (seo) => (seo as GraphqlFieldsSelector<Seo>).title === true)
        .sub(
          "seo",
          "meta_description",
          (seo) => (seo as GraphqlFieldsSelector<Seo>).description === true
        )
        .sub("seo", "meta_keywords", (seo) => (seo as GraphqlFieldsSelector<Seo>).keywords === true)
        .sub(
          "seo",
          "canonical_url",
          (seo) => (seo as GraphqlFieldsSelector<Seo>).canonical === true
        )
        .map(fields)
    );
  }
}
