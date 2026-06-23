import type { GraphqlClient } from "@comity/graphql-client";
import type { StorefrontContext } from "@comity/storefront";
import type { RouteQueryInput } from "../schema/queries/route.js";

import { buildQuery, graphqlVar } from "@comity/graphql-builder";
import { RouteQueryInputSchema } from "../schema/queries/route.js";

/**
 * GraphQL response structure for route queries.
 */
export interface MagentoRouteQuery {
  /** Routed entity details by URL. */
  readonly route?: Readonly<{
    /** Redirect code for requested URL. */
    redirect_code?: number;

    /** Relative URL for routed resource. */
    relative_url?: string;

    /** Routed entity type value. */
    type?: string;

    /** Category/Product UID when available. */
    uid?: string;

    /** CMS page identifier when available. */
    identifier?: string;

    /** Product SKU when available. */
    sku?: string;
  }>;
}

/**
 * Builds and executes a Magento route query.
 *
 * @param client - GraphQL client used to execute the request.
 * @param operation - Operation name for GraphQL tracing.
 * @param input - Route query variables payload.
 * @param ctx - Optional storefront context containing tenant information.
 *
 * @returns GraphQL result payload including route data and optional errors.
 */
export async function buildRouteQuery(
  client: GraphqlClient,
  operation: string,
  input: RouteQueryInput,
  ctx?: StorefrontContext
) {
  const validated = RouteQueryInputSchema.parse(input);
  const store = ctx?.tenant;
  const headers = {
    accept: "application/json",
    ...(store ? { store } : {}),
  };

  const query = buildQuery<MagentoRouteQuery>(
    {
      $type: "query",
      $name: operation,
      $vars: {
        $url: "String!",
      },
      route: {
        $args: {
          url: graphqlVar("url"),
        },
        redirect_code: true,
        relative_url: true,
        type: true,
        "... on CategoryTree": {
          uid: true,
        },
        "... on CmsPage": {
          identifier: true,
        },
        "... on ProductInterface": {
          uid: true,
          sku: true,
        },
        "... on VirtualProduct": {
          uid: true,
          sku: true,
        },
        "... on SimpleProduct": {
          uid: true,
          sku: true,
        },
        "... on ConfigurableProduct": {
          uid: true,
          sku: true,
        },
        "... on DownloadableProduct": {
          uid: true,
          sku: true,
        },
        "... on GroupedProduct": {
          uid: true,
          sku: true,
        },
        "... on BundleProduct": {
          uid: true,
          sku: true,
        },
      } as Record<string, unknown>,
    },
    { indent: false }
  );

  return client.query<MagentoRouteQuery>({
    query,
    variables: validated as Record<string, unknown>,
    operationName: operation,
    headers,
  });
}
