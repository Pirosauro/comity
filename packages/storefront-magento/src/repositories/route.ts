import type { GraphqlClient } from "@comity/graphql-client";
import type { RepositoryError } from "@comity/primitives/error";
import type { Result } from "@comity/primitives/result";
import type { StorefrontContext } from "@comity/storefront";
import type { MagentoRouteQuery } from "../internal/graphql/route.js";
import type { RouteQueryInput } from "../internal/schema/queries/route.js";

import { RepositoryError as RepositoryErrorClass } from "@comity/primitives/error";
import { failure, success } from "@comity/primitives/result";
import { buildRouteQuery } from "../internal/graphql/route.js";

/**
 * Lightweight route metadata resolved by Magento.
 */
export type MagentoRouteModel = {
  /** Redirect status code returned by Magento when applicable. */
  redirectCode?: number;

  /** Canonical relative path resolved by Magento for the requested URL. */
  relativeUrl?: string;

  /** Routed entity type (for example PRODUCT, CATEGORY, CMS_PAGE). */
  type?: string;

  /** Runtime typename for routed entity. */
  typename?: string;

  /** Routed entity UID when available (categories and products). */
  uid?: string;

  /** Routed CMS page identifier when available. */
  identifier?: string;

  /** Routed product SKU when available. */
  sku?: string;
};

/**
 * Repository that resolves storefront paths using Magento's route query.
 */
export class MagentoGraphqlRouteRepository {
  /** GraphQL client used for route requests. */
  #graphql: GraphqlClient;

  /**
   * @param graphql GraphQL client instance.
   */
  constructor(graphql: GraphqlClient) {
    this.#graphql = graphql;
  }

  /**
   * Resolves a storefront URL path through Magento route query.
   *
   * @param url - URL path without host (for example `men/tops.html`).
   * @param ctx - Optional storefront context for tenant-scoped route resolution.
   *
   * @returns Resolved route metadata or null when unresolved.
   */
  async resolve(
    url: string,
    ctx?: StorefrontContext
  ): Promise<Result<MagentoRouteModel | null, RepositoryError>> {
    try {
      const input: RouteQueryInput = {
        url,
      };

      const result = await this.buildQuery("ResolveRoute", input, ctx);
      const route = result.data?.route;

      if (!route) {
        return success(null);
      }

      return success(this.toModel(route));
    } catch (cause) {
      return failure(
        new RepositoryErrorClass("service_unavailable", {
          details: {
            repository: "MagentoGraphqlRouteRepository",
            operation: "ResolveRoute",
          },
          cause,
          context: {
            url,
          },
        })
      );
    }
  }

  /**
   * Executes the route query operation.
   *
   * @param name - GraphQL operation name.
   * @param input - Route query variables payload.
   * @param ctx - Optional storefront context for tenant-scoped route resolution.
   *
   * @returns GraphQL response payload for the route query.
   */
  protected buildQuery(name: string, input: RouteQueryInput, ctx?: StorefrontContext) {
    return buildRouteQuery(this.#graphql, name, input, ctx);
  }

  /**
   * Maps GraphQL route payload to a lightweight route model.
   *
   * @param route - Route payload returned by Magento.
   *
   * @returns Lightweight route metadata used by storefront middleware.
   */
  protected toModel(route: NonNullable<MagentoRouteQuery["route"]>): MagentoRouteModel {
    return {
      ...(route.redirect_code !== undefined ? { redirectCode: route.redirect_code } : {}),
      ...(route.relative_url ? { relativeUrl: route.relative_url } : {}),
      ...(route.type ? { type: route.type } : {}),
      ...(route.uid ? { uid: route.uid } : {}),
      ...(route.identifier ? { identifier: route.identifier } : {}),
      ...(route.sku ? { sku: route.sku } : {}),
    };
  }
}

/**
 * Backward-compatible alias for older imports.
 */
export const GraphqlRouteRepository = MagentoGraphqlRouteRepository;
