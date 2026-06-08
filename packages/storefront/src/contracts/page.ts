import type { PageModel } from "@comity/content";

/**
 * Represents a generic storefront page model.
 */
export interface StorefrontPageModel extends PageModel {
  /** The type of the page. */
  readonly type: string;
}
