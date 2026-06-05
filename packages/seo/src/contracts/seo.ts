import type { OpenGraphModel } from "./open-graph.js";
import type { StructuredDataModel } from "./structured-data.js";
import type { TwitterCardModel } from "./twitter-card.js";

/**
 * Search Engine Optimization metadata.
 */
export interface SeoModel {
  /** Page title for search results. */
  readonly title?: string;

  /** Page description for search results. */
  readonly description?: string;

  /** Comma-separated keywords. */
  readonly keywords?: string;

  /** Canonical URL for this page. */
  readonly canonical?: string;

  /** Robots directives (noindex, nofollow, etc). */
  readonly robots?: string;

  /** Open Graph social media metadata. */
  readonly openGraph?: OpenGraphModel;

  /** Twitter Card social media metadata. */
  readonly twitterCard?: TwitterCardModel;

  /** Structured data for SEO purposes. */
  readonly structuredData?: ReadonlyArray<StructuredDataModel>;
}
