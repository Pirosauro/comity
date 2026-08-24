import type { RepositoryError } from "@comity/primitives/errors";
import type { Result } from "@comity/primitives/result";

import type { BrandProjection } from "./brand.js";
import type { CatalogRepositoryContext } from "./repository-context.js";

/**
 * Brand repository contract.
 */
export interface BrandRepository {
  /**
   * Retrieve a brand by identifier.
   *
   * @param id - Brand ID.
   * @param ctx - Context for the repository request, including fields selection, locale, and tenant information.
   *
   * @returns Brand model or null if not found.
   */
  getById(
    id: string,
    ctx?: CatalogRepositoryContext
  ): Promise<Result<BrandProjection | null, RepositoryError>>;

  /**
   * Retrieve a brand by URL slug.
   *
   * @param slug - URL-friendly slug.
   * @param ctx - Context for the repository request, including fields selection, locale, and tenant information.
   *
   * @returns Brand model or null if not found.
   */
  getBySlug(
    slug: string,
    ctx?: CatalogRepositoryContext
  ): Promise<Result<BrandProjection | null, RepositoryError>>;
}
