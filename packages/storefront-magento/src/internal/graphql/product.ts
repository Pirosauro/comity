import type { CatalogRepositoryContext } from "@comity/catalog";
import type { GraphqlClient } from "@comity/graphql-client";
import type { ProductsQueryInput } from "../schema/queries/product.js";
import type { MediaGallery, PriceRange, SearchResultPageInfo, UrlRewrite } from "./types.js";

import { buildQuery, graphqlVar } from "@comity/graphql-builder";
import { ProductsQueryInputSchema } from "../schema/queries/product.js";

/**
 * Product attribute data structure used in GraphQL responses, representing custom attributes for products.
 */
export interface ProductAttribute {
  /** Attribute code for the product. */
  readonly code?: string;

  /** Attribute value for the product. */
  readonly value?: string | number | boolean;

  /** Selected options for the attribute. */
  readonly selected_options?: ReadonlyArray<{
    /** Option label for the selected attribute value. */
    label?: string;

    /** Option value for the selected attribute value. */
    value?: string | number | boolean;
  }>;
}

/**
 * Product interface representation for storefront queries.
 */
export interface MagentoProduct {
  /** Relative canonical URL for the product. */
  readonly canonical_url?: string;

  /** Product custom attributes container. */
  readonly custom_attributesV2?: {
    /** List of custom attributes for the product. */
    readonly items?: ReadonlyArray<ProductAttribute>;
  };

  /** Detailed product description (may contain HTML). */
  readonly description?: {
    /** Text that can contain HTML tags. */
    readonly html?: string;
  };

  /** Product media gallery entries. */
  readonly media_gallery?: ReadonlyArray<MediaGallery>;

  /** Product meta description value. */
  readonly meta_description?: string;

  /** Product meta keyword value. */
  readonly meta_keyword?: string;

  /** Product meta title value. */
  readonly meta_title?: string;

  /** Product name. */
  readonly name?: string;

  /** Indicates whether the product is only available in a limited quantity. */
  readonly only_x_left_in_stock?: number;

  /** Range of prices for this product. */
  readonly price_range?: PriceRange;

  /** Product available quantity. */
  readonly quantity?: number;

  /** Product SKU. */
  readonly sku?: string;

  /** Stock status. */
  readonly stock_status?: "IN_STOCK" | "OUT_OF_STOCK";

  /** Unique ID for this product. */
  readonly uid?: string;

  /** URL rewrites list. */
  readonly url_rewrites?: ReadonlyArray<UrlRewrite>;
}

/**
 * GraphQL response structure for product queries, containing product items and pagination information.
 */
export interface MagentoProductQuery {
  /** Product query result container. */
  readonly products: Readonly<{
    /** Product list for current page. */
    items?: ReadonlyArray<MagentoProduct>;

    /** Pagination information for products. */
    page_info?: SearchResultPageInfo;

    /** Total number of matching products. */
    total_count?: number;
  }>;
}

/**
 * Builds a GraphQL query for fetching product data based on the provided operation name, input parameters, and optional catalog repository context. This function constructs a GraphQL query using the `buildQuery` utility, incorporating the necessary fields and arguments to retrieve product information from the backend API. The input parameters are validated against the `ProductsQueryInputSchema` to ensure they meet the expected format before executing the query. The function also handles setting appropriate headers based on the provided context, such as store information, to ensure the query is executed in the correct scope.
 *
 * @param client - The GraphQL client instance used to execute the query.
 * @param operation - The name of the GraphQL query operation to be executed.
 * @param input - The input parameters for the query, validated against the `ProductsQueryInputSchema`.
 * @param ctx - Optional context for the repository request, including fields selection, locale, currency, and tenant information.
 *
 * @returns A promise that resolves to the result of the GraphQL query, containing product data or an error if the request fails.
 */
export async function buildProductQuery(
  client: GraphqlClient,
  operation: string,
  input: ProductsQueryInput,
  ctx?: CatalogRepositoryContext
) {
  const store = ctx?.tenant;
  const validated = ProductsQueryInputSchema.parse(input);
  const query = buildQuery<MagentoProductQuery>(
    {
      $type: "query",
      $name: operation,
      $vars: {
        $filter: "ProductAttributeFilterInput",
        $currentPage: "Int",
        $pageSize: "Int",
      },
      products: {
        $args: {
          filter: graphqlVar("filter"),
          currentPage: graphqlVar("currentPage"),
          pageSize: graphqlVar("pageSize"),
        },
        items: {
          uid: true,
          sku: true,
          name: true,
          description: {
            html: true,
          },
          url_rewrites: {
            url: true,
          },
          media_gallery: {
            url: true,
            label: true,
            position: true,
          },
          stock_status: true,
          quantity: true,
          only_x_left_in_stock: true,
          price_range: {
            minimum_price: {
              regular_price: { value: true, currency: true },
              final_price: { value: true, currency: true },
            },
          },
          meta_title: true,
          meta_description: true,
          meta_keyword: true,
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

  const result = await client.query<MagentoProductQuery>({
    query,
    variables: validated as Record<string, unknown>,
    operationName: operation,
    headers: store ? { store } : {},
  });

  return result;
}
