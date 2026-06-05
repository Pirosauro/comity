/**
 * Open Graph social media metadata.
 */
export interface OpenGraphModel {
  /** Social share title. */
  readonly title?: string;

  /** Social share description. */
  readonly description?: string;

  /** Social share image URL. */
  readonly image?: string;

  /** Social share URL. */
  readonly url?: string;

  /** Site name. */
  readonly siteName?: string;

  /** og:type value. */
  readonly type?: string;

  /** Locale code. */
  readonly locale?: string;
}
