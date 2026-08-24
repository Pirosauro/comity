import type { MediaModel } from "@comity/media";

/**
 * Brand projection.
 *
 * Represents the producer or manufacturer associated with products in the
 * catalog.
 */
export interface BrandProjection {
  /** Unique brand identifier. */
  readonly id: string;

  /** Display name. */
  readonly name: string;

  /** URL-friendly slug. */
  readonly slug?: string;

  /** Brand description. */
  readonly description?: string;

  /** Brand logo or media reference. */
  readonly logo?: MediaModel;
}