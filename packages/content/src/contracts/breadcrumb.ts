/**
 * Breadcrumb item model for navigation.
 */
export interface BreadcrumbModel {
  /** Label for the breadcrumb item. */
  readonly label: string;

  /** URL for the breadcrumb item. */
  readonly url?: string;
}
