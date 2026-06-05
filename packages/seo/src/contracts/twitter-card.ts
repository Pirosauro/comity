/**
 * Twitter Card social media metadata.
 */
export interface TwitterCardModel {
  /** Card type (summary, summary_large_image, etc). */
  readonly card?: string;

  /** Twitter share title. */
  readonly title?: string;

  /** Twitter share description. */
  readonly description?: string;

  /** Twitter share image URL. */
  readonly image?: string;

  /** Twitter creator handle. */
  readonly creator?: string;

  /** Twitter site handle. */
  readonly site?: string;
}
