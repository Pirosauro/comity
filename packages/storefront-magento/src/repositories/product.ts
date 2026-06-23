import type { CatalogRepositoryContext, ProductModel, ProductRepository } from "@comity/catalog";
import type { GraphqlClient } from "@comity/graphql-client";
import type { Result } from "@comity/primitives/result";
import type { SearchCriteriaModel, SearchResultModel } from "@comity/search";
import type { MagentoProduct } from "../internal/graphql/product.js";
import type { UrlRewrite } from "../internal/mappers/product.js";
import type { ProductsQueryInput } from "../internal/schema/queries/product.js";

import { RepositoryError } from "@comity/primitives/error";
import { failure, success } from "@comity/primitives/result";
import { toMagentoFilter } from "../internal/filters/magento.js";
import { buildProductQuery } from "../internal/graphql/product.js";
import { toProductModel } from "../internal/mappers/product.js";

/**
 * Optional settings for the Magento product repository.
 */
export interface GraphqlProductRepositoryOptions {
  /** Optional strategy for selecting canonical product URL. */
  generateUrl?: (urlRewrites: UrlRewrite[]) => string | undefined;
}

/**
 * Magento GraphQL implementation of product repository.
 */
export class MagentoGraphqlProductRepository implements ProductRepository {
  /** GraphQL client used to execute Magento queries. */
  #graphql: GraphqlClient;

  /** Repository configuration options. */
  #options: GraphqlProductRepositoryOptions;

  /**
   * @param graphql - GraphQL client instance.
   * @param options - Optional repository settings.
   */
  constructor(graphql: GraphqlClient, options?: GraphqlProductRepositoryOptions) {
    this.#graphql = graphql;
    this.#options = options ?? {};
  }

  /**
   * Searches products by query text and optional filters.
   *
   * @param input - Search criteria including query text and filters.
   * @param ctx - Optional catalog repository context.
   *
   * @returns Paginated search results of products.
   */
  async search(
    input: SearchCriteriaModel,
    ctx?: CatalogRepositoryContext
  ): Promise<Result<SearchResultModel<ProductModel>, RepositoryError>> {
    try {
      const filter = toMagentoFilter(input.filters);
      const page = input.pagination?.page ?? 1;
      const pageSize = input.pagination?.pageSize ?? 20;

      const result = await this.buildQuery(
        "SearchProducts",
        {
          filter,
          currentPage: page,
          pageSize,
          search: input.query,
        },
        ctx
      );

      return success({
        items: result.data?.products?.items?.map((node) => this.toModel(node)) ?? [],
        total: result.data?.products?.total_count ?? 0,
        page: result.data?.products?.page_info?.current_page ?? page,
        pageSize: result.data?.products?.page_info?.page_size ?? pageSize,
      });
    } catch (cause) {
      return failure(
        new RepositoryError("service_unavailable", {
          details: {
            repository: "MagentoGraphqlProductRepository",
            operation: "SearchProducts",
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
   * Lists products by generic search criteria.
   *
   * @param input - Search criteria without query text.
   * @param ctx - Optional catalog repository context.
   *
   * @returns Paginated product search result.
   */
  async list(
    input: Omit<SearchCriteriaModel, "query">,
    ctx?: CatalogRepositoryContext
  ): Promise<Result<SearchResultModel<ProductModel>, RepositoryError>> {
    try {
      const filter = toMagentoFilter(input.filters);
      const page = input.pagination?.page ?? 1;
      const pageSize = input.pagination?.pageSize ?? 20;
      const result = await this.buildQuery(
        "ListProducts",
        {
          filter,
          currentPage: page,
          pageSize,
        },
        ctx
      );

      return success({
        items: result.data?.products?.items?.map((node) => this.toModel(node)) ?? [],
        total: result.data?.products?.total_count ?? 0,
        page: result.data?.products?.page_info?.current_page ?? page,
        pageSize: result.data?.products?.page_info?.page_size ?? pageSize,
      });
    } catch (cause) {
      return failure(
        new RepositoryError("service_unavailable", {
          details: {
            repository: "MagentoGraphqlProductRepository",
            operation: "ListProducts",
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
   * Gets a product by identifier.
   *
   * @param id - Product identifier.
   * @param ctx - Optional catalog repository context.
   *
   * @returns Product model or null when not found.
   */
  async get(
    id: string,
    ctx?: CatalogRepositoryContext
  ): Promise<Result<ProductModel | null, RepositoryError>> {
    try {
      const input: ProductsQueryInput = {
        filter: {
          sku: {
            eq: id,
          },
        },
        pageSize: 1,
        currentPage: 1,
      };

      const result = await this.buildQuery("GetProductById", input, ctx);
      const node = result.data?.products?.items?.[0];

      if (!node) {
        return success(null);
      }

      return success(this.toModel(node));
    } catch (cause) {
      return failure(
        new RepositoryError("service_unavailable", {
          cause,
          details: {
            repository: "MagentoGraphqlProductRepository",
            operation: "GetProductById",
          },
          context: {
            id,
          },
        })
      );
    }
  }

  /**
   * Gets a product by slug.
   *
   * @param slug - Product URL slug.
   * @param ctx - Optional catalog repository context.
   *
   * @returns Product model or null when not found.
   */
  async getBySlug(
    slug: string,
    ctx?: CatalogRepositoryContext
  ): Promise<Result<ProductModel | null, RepositoryError>> {
    try {
      const input: ProductsQueryInput = {
        filter: {
          url_key: {
            eq: slug,
          },
        },
        pageSize: 1,
        currentPage: 1,
      };

      const result = await this.buildQuery("GetProductBySlug", input, ctx);
      const node = result.data?.products?.items?.[0];

      if (!node) {
        return success(null);
      }

      return success(this.toModel(node));
    } catch (cause) {
      return failure(
        new RepositoryError("service_unavailable", {
          cause,
          details: {
            repository: "MagentoGraphqlProductRepository",
            operation: "GetProductBySlug",
          },
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
   * @param ctx - Optional context for the repository request, including fields selection, locale, currency, and tenant information. This context can be used to customize the behavior of the query execution, such as selecting specific fields to include in the response or providing tenant-specific information for multi-tenant applications.
   *
   * @returns A promise that resolves to the category tree data associated with the provided ID. The data includes various properties of the category, such as its name, description, URL, and relationships to other categories. If the category tree is not found or if there is an error during the fetch operation, the promise may reject with an appropriate error message.
   */
  protected buildQuery(name: string, input: ProductsQueryInput, ctx?: CatalogRepositoryContext) {
    return buildProductQuery(this.#graphql, name, input, ctx);
  }

  /**
   * Transforms the raw category tree data received from the GraphQL API into a structured `CategoryModel` that can be used by other parts of the application. This method takes the raw data, which may include various properties and relationships, and maps it to the defined structure of the `CategoryModel`, ensuring that the data is consistent and usable within the application's domain logic. The transformation may involve renaming fields, converting data types, and organizing nested relationships to fit the expected format of the `CategoryModel`.
   *
   * @param data - The raw category tree data received from the GraphQL API, which may include various properties such as the category's name, description, URL, and relationships to other categories. This data is typically in a format that closely matches the structure of the GraphQL response and may require transformation to fit the application's domain model.
   *
   * @returns A `CategoryModel` object that represents the category data in a structured format, with properties and relationships organized according to the application's domain model. This model can be used by other parts of the application to display category information, manage category relationships, and perform other operations related to categories.
   */
  protected toModel(data: MagentoProduct): ProductModel {
    return toProductModel(data);
  }
}
