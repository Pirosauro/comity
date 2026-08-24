import type { MediaModel } from "@comity/media";

/**
 * Taxonomy kind.
 *
 * Categories are the primary taxonomy in catalogs; tags and other
 * classifications are additional kinds. The union is kept closed to remain
 * shared and framework-agnostic.
 */
export type TaxonomyKind = "category" | "tag";

/**
 * Category model.
 *
 * The base taxonomy shape shared by consumers such as catalog, blog, and
 * content modules.
 */
export interface CategoryModel {
  /** Unique identifier. */
  readonly id: string;

  /** Absolute page URL. */
  readonly url?: string;

  /** Display name. */
  readonly name: string;

  /** URL-friendly slug. */
  readonly slug?: string;

  /** Description. */
  readonly description?: string;

  /** Identifier of the parent category, if any. */
  readonly parentId?: string;

  /** Featured image. */
  readonly image?: MediaModel;
}

/**
 * Taxonomy model, extending the category shape with a classification kind.
 */
export interface TaxonomyModel extends CategoryModel {
  /** Classification kind. */
  readonly kind: TaxonomyKind;
}