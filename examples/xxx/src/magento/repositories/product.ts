import type { GraphqlClient } from "@comity/graphql-client";
import type { Result } from "@comity/primitives/result";
import type { CategoryViewModel } from "../../view-models/category.js";
import type { CategoryTree } from "../graphql/category-tree.js";

import { GraphqlClientError } from "@comity/graphql-client/error";
import { failure, success } from "@comity/primitives/result";
import { normalizeToInt } from "../normalize.js";

/**
 * The `GraphqlProductListData` type represents the structure of product list data that is retrieved from a GraphQL API. It includes properties such as `id`, `description`, `meta_description`, `meta_keywords`, `meta_title`, `name`, `path`, and `path_in_store`. This type is used to define the shape of the data returned by the `GraphqlProductRepository` when fetching product list information based on a unique identifier (ID). The properties included in this type provide essential details about a product, allowing other parts of the application to utilize this information for display or further processing.
 */
export type GraphqlProductListData = Pick<
  CategoryTree,
  | "id"
  | "description"
  | "meta_description"
  | "meta_keywords"
  | "meta_title"
  | "name"
  | "path"
  | "path_in_store"
  | "children_count"
  | "image"
  | "product_count"
  | "url_path"
  | "url_suffix"
  | "url_key"
  | "canonical_url"
>;

/**
 *
 */
export type GetProductListOptions = {
  /** Store code */
  store?: string;

  /** Pagination cursor for the next page of results */
  cursor?: string;

  /** Number of items to fetch per page */
  limit?: number;
};

/**
 *
 */
export interface ProductRepository {
  /**
   * Fetches a category tree by its unique identifier (ID). This method sends a GraphQL query to the server, requesting the category tree data associated with the provided ID. The response is expected to include details about the category, such as its name, description, URL, and any child categories it may have. The method returns the category tree data in a structured format that can be used by other parts of the application to display or manipulate the category information.
   *
   * @param uid - The unique identifier of the category tree to be fetched. This ID is typically a string that corresponds to the category's unique key in the database or backend system. It is used to specify which category tree should be retrieved from the server.
   * @param store - Optional store ID to fetch the category tree for a specific store view.
   *
   * @returns A promise that resolves to the category tree data associated with the provided ID. The data includes various properties of the category, such as its name, description, URL, and relationships to other categories. If the category tree is not found or if there is an error during the fetch operation, the promise may reject with an appropriate error message.
   */
  getListByCategoryId(
    uid: string,
    options?: GetProductListOptions
  ): Promise<Result<CategoryViewModel | null, GraphqlClientError>>;
}

/**
 * The `GraphqlProductRepository` class is an implementation of the `ProductRepository` interface that uses a GraphQL client to fetch product data from a GraphQL API. This repository provides methods to retrieve product information based on unique identifiers, allowing other parts of the application to access and manipulate product data as needed. The class encapsulates the logic for constructing and sending GraphQL queries, handling responses, and returning structured product data to the caller.
 */
export class GraphqlProductRepository implements ProductRepository {
  /** */
  #graphql: GraphqlClient;

  /**
   * @param graphql - An instance of the `GraphqlClient` that will be used to execute GraphQL queries and mutations related to products. This client provides methods for sending requests to a GraphQL server and handling responses, allowing the repository to interact with the backend API to fetch and manipulate product data.
   */
  constructor(graphql: GraphqlClient) {
    this.#graphql = graphql;
  }

  /**
   * @inheritdoc
   */
  async getListByCategoryId(
    uid: string,
    options?: GetProductListOptions
  ): Promise<Result<CategoryViewModel | null, GraphqlClientError>> {
    const client = this.#graphql;
    const { store, ...vars } = options ?? {};

    try {
      const result = await client.query<{
        /** */
        products: {
          /** */
          items: GraphqlCategoryData[];
        };
      }>({
        query: `
          query GetCategoryProducts($uid: String!, $limit: Int, $cursor: String) {
            products(
              filter: { category_uid: { eq: $uid } }
              pageSize: $limit
              currentPage: $cursor
            ) {
              items {
                canonical_url
                sku
                stock_status
                url_rewrites {
                  url
                }
                price {
                  regularPrice {
                    amount {
                      currency
                      value
                    }
                  }
                  minimalPrice {
                    amount {
                      currency
                      value
                    }
                  }
                  maximalPrice {
                    amount {
                      currency
                      value
                    }
                  }
                }
                only_x_left_in_stock
                name
                meta_title
                meta_keyword
                meta_description
                id
              }
            }
          }
        `,
        variables: { uid, ...vars },
        operationName: "GetCategoryProducts",
        ...(store ? { headers: { store } } : {}),
      });

      if (result.errors?.length) {
        return failure(
          new GraphqlClientError("protocol_error", {
            details: {
              operationName: "GetCategoryProducts",
              errors: result.errors,
            },
            context: {
              uid,
              store,
            },
          })
        );
      }

      const data = result.data?.products?.items?.length
        ? result.data?.products?.items.map(this.#toCommon)
        : [];

      return success(data);
    } catch (cause) {
      if (cause instanceof GraphqlClientError) {
        return failure(cause);
      }

      return failure(
        new GraphqlClientError("transport_error", {
          cause,
          details: {
            operationName: "GetCategoryProducts",
          },
          context: {
            uid,
            store,
          },
        })
      );
    }
  }

  /**
   * Converts the raw category tree data retrieved from the GraphQL API into a common `CategoryViewModel` format that can be used by other parts of the application. This method takes the `GraphqlCategoryData` as input and maps its properties to the corresponding fields in the `CategoryViewModel`, ensuring that the data is structured in a way that is consistent with the application's view layer. The method handles any necessary transformations, such as normalizing numeric values or constructing URLs, to ensure that the resulting `CategoryViewModel` is ready for use in the presentation layer.
   *
   * @param data - The raw category tree data retrieved from the GraphQL API, represented as a `GraphqlCategoryData` object. This data includes various properties of the category, such as its name, description, URL components, and counts of products and child categories.
   *
   * @returns A `CategoryViewModel` object that contains the mapped and normalized category data, ready for use in the presentation layer of the application. The view model includes properties such as `name`, `description`, `image`, `url`, `slug`, `productCount`, and `childrenCount`, which are derived from the corresponding fields in the input data.
   */
  #toCommon(data: GraphqlCategoryData): CategoryViewModel {
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
