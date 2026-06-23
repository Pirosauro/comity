import type { CatalogRepositoryContext } from "@comity/catalog";
import type { GraphqlClient } from "@comity/graphql-client";
import type { MagentoGraphqlCategoryQueryInput } from "../schema/queries/category.js";
import type { SearchResultPageInfo } from "./types.js";

import { buildQuery, graphqlVar } from "@comity/graphql-builder";
import { toCategoryTree } from "../mappers/category.js";
import { MagentoGraphqlCategoryQueryInputSchema } from "../schema/queries/category.js";

/**
 * Single breadcrumb item for category navigation.
 */
export interface Breadcrumb {
  /** Category level for this breadcrumb. */
  readonly category_level?: number;

  /** Category name for this breadcrumb. */
  readonly category_name?: string;

  /** Category unique identifier for this breadcrumb. */
  readonly category_uid?: string;

  /** Category URL path for this breadcrumb. */
  readonly category_url_path?: string;
}

/**
 * Magento category tree node data structure used in GraphQL responses.
 */
export interface MagentoCategory {
  /** Breadcrumbs for this category location. */
  readonly breadcrumbs?: ReadonlyArray<Breadcrumb>;

  /** Canonical URL for this category page. */
  readonly canonical_url?: string;

  /** Category description text. */
  readonly description?: string;

  /** Category image URL value. */
  readonly image?: string;

  /** Meta description value for SEO. */
  readonly meta_description?: string;

  /** Meta keywords value for SEO. */
  readonly meta_keywords?: string;

  /** Meta title value for SEO. */
  readonly meta_title?: string;

  /** Category name displayed to users. */
  readonly name?: string;

  /** Indicates whether search engines should archive this category page. */
  readonly no_archive?: boolean;

  /** Indicates whether search engines should follow links on this category page. */
  readonly no_follow?: boolean;

  /** Indicates whether the category should be excluded from search engine indexing. */
  readonly no_index?: boolean;

  /** Unique category identifier. */
  readonly uid?: string;

  /** Category URL path in storefront. */
  readonly url_path?: string;

  /** Category URL suffix in storefront. */
  readonly url_suffix?: string;
}

/**
 * GraphQL response structure for category tree queries, containing category items and pagination information.
 */
export interface MagentoCategoryQuery {
  /**  */
  readonly categories?: Readonly<{
    /** Category items matching filters. */
    items?: ReadonlyArray<MagentoCategory>;

    /** Pagination information for categories. */
    page_info?: SearchResultPageInfo;

    /** Total number of matching categories. */
    total_count?: number;
  }>;
}

/**
 * Builds a GraphQL query for fetching category data based on the provided operation name, input parameters, and optional catalog repository context.
 *
 * @param client - An instance of the `GraphqlClient` used to execute the GraphQL query against the backend API.
 * @param operation - The name of the GraphQL query operation.
 * @param input - The input parameters for the GraphQL query.
 * @param ctx - Optional catalog repository context.
 *
 * @returns A promise that resolves to the result of the GraphQL query, containing category data or an error if the request fails.
 */
export async function buildCategoryQuery(
  client: GraphqlClient,
  operation: string,
  input: MagentoGraphqlCategoryQueryInput,
  ctx?: CatalogRepositoryContext
) {
  const store = ctx?.tenant;
  const validated = MagentoGraphqlCategoryQueryInputSchema.parse(input);
  const fields = ctx?.fields ? toCategoryTree(ctx.fields) : undefined;
  const headers = {
    accept: "application/json",
    ...(store ? { store } : {}),
  };
  const query = buildQuery<MagentoCategoryQuery>(
    {
      $type: "query",
      $name: operation,
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
  const result = await client.query<MagentoCategoryQuery>({
    query,
    variables: validated as Record<string, unknown>,
    operationName: operation,
    headers,
  });

  return result;
}
