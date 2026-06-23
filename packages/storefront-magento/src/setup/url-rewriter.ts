import type { HttpContext } from "@comity/http";
import type { UrlRewriter } from "@comity/router";
import type { StorefrontContext } from "@comity/storefront";
import type { MagentoGraphqlRouteRepository } from "../repositories/route.js";

import { isSuccess } from "@comity/primitives/result";

/**
 * Optional configuration for the `MagentoUrlRewriter` class, allowing to specify a default store for route queries when tenant information is not available in the storefront context. This can be useful in scenarios where the URL rewriting needs to be performed without a specific tenant context, providing a fallback mechanism for route resolution based on a predefined store code.
 */
export interface MagentoUrlRewriterOptions {
  /** Category route rewriting enabled */
  category: boolean;

  /** Product route rewriting enabled */
  product: boolean;
}

/**
 * The `MagentoUrlRewriter` class is responsible for rewriting URLs based on the routes defined in a Magento GraphQL repository. It implements the `UrlRewriter` interface, allowing it to be used within a routing system to resolve incoming URLs to their corresponding Magento routes. The class utilizes the `MagentoGraphqlRouteRepository` to fetch the appropriate route information and rewrite the URL accordingly. If a matching route is found, it returns the rewritten URL; otherwise, it returns null, indicating that no rewrite was performed.
 */
export class MagentoUrlRewriter implements UrlRewriter {
  #repository: MagentoGraphqlRouteRepository;
  #options: MagentoUrlRewriterOptions;

  /**
   * @param repository - The repository used for fetching Magento GraphQL routes.
   * @param options - Optional configuration for route rewriting behavior.
   */
  constructor(
    repository: MagentoGraphqlRouteRepository,
    options?: Partial<MagentoUrlRewriterOptions>
  ) {
    this.#repository = repository;
    this.#options = {
      category: options?.category ?? true,
      product: options?.product ?? true,
    };
  }

  /**
   * @inheritdoc
   */
  async rewrite(url: URL, ctx: HttpContext): Promise<URL | null> {
    const storefront = ctx.state?.["storefront"] as StorefrontContext | undefined;
    const result = await this.#repository.resolve(url.pathname, storefront);

    if (!isSuccess(result) || !result.value) {
      return null;
    }

    switch (result.value.type) {
      case "category":
        return this.#options.category ? new URL(`/category/${result.value.uid!}`, url) : null;
        break;

      case "product":
        return this.#options.product ? new URL(`/product/${result.value.uid!}`, url) : null;
        break;
    }

    return null;
  }
}
