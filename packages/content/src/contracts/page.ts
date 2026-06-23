import type { MediaModel } from "@comity/media";
import type { SeoModel } from "@comity/seo";
import type { BlockModel } from "./block.js";

/**
 * CMS Page model.
 */
export interface PageModel {
  /** Unique page identifier. */
  readonly id: string;

  /** URL for routing. */
  readonly url: string;

  /** Publication status. */
  readonly status?: "published" | "draft" | "archived";

  /** Display title. */
  readonly title: string;

  /** Layout identifier. */
  readonly layout?: string;

  /** Content blocks. */
  readonly blocks?: readonly BlockModel[];

  /** Short summary. */
  readonly excerpt?: string;

  /** Featured image. */
  readonly image?: MediaModel;

  /** SEO metadata. */
  readonly seo?: SeoModel;

  /** Localized versions of the page. */
  readonly alternates?: ReadonlyArray<LocalizedResourceModel>;

  /** Creation timestamp. */
  readonly createdAt?: Date;

  /** Last modification timestamp. */
  readonly updatedAt?: Date;
}

/**
 * Localized resource model (e.g., for page translations).
 */
export interface LocalizedResourceModel {
  /** Locale code (e.g., "en-US"). */
  readonly locale: string;

  /** URL for the localized resource. */
  readonly url: string;
}
