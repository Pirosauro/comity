/**
 * Category view model
 */
export interface CategoryViewModel {
  /** Category display name */
  readonly name: string;

  /** Optional description */
  readonly description?: string;

  /** Absolute image URL */
  readonly image?: string;

  /** Absolute page URL */
  readonly url: string;

  /** Slug (for routing / analytics) */
  readonly slug: string;

  /** Number of products */
  readonly productCount?: number;

  /** Children categories */
  readonly childrenCount?: number;

  /** Parent category */
  readonly parent?: CategoryViewModel;

  /** Meta information for SEO */
  readonly meta?: {
    /** Meta title for SEO */
    readonly title?: string;

    /** Meta description for SEO */
    readonly description?: string;

    /** Meta keywords for SEO */
    readonly keywords?: string;
  };
}
