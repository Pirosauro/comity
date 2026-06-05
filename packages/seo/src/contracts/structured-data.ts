/**
 * Structured data model for SEO purposes.
 */
export interface StructuredDataModel {
  /** Structured data type. */
  readonly type: string;

  /** Structured data content. */
  readonly data: Record<string, unknown>;
}
