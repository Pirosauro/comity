import type { MediaModel } from "@comity/media";

import type { BrandProjection } from "./brand.js";

/**
 * Product lifecycle status.
 *
 * @remarks
 * A product starts in {@link ProductStatus."draft"} and progresses through a
 * linear lifecycle. Each transition is explicit and cannot move backwards.
 *
 * Transitions:
 * - `draft` → `active`
 * - `active` → `inactive` | `archived`
 * - `inactive` → `active` | `archived`
 * - `archived` → (terminal)
 */
export type ProductStatus = "draft" | "active" | "inactive" | "archived";

/**
 * Product type metadata.
 *
 * An opaque, application-defined classification (e.g. "physical", "digital",
 * "subscription"). Comity defines no concrete product classes; the catalog
 * stays neutral and extensible by the application layer.
 */
export type ProductType = string;

/**
 * Product attribute — a dynamic property of a product or variant.
 */
export interface ProductAttribute {
  /** A unique identifier for the attribute. */
  readonly code: string;

  /** The display name of the attribute. */
  readonly label?: string;

  /** The value of the attribute. */
  readonly value: string | number | boolean;
}

/**
 * Selected option value for a variant (e.g. size = "M", color = "blue").
 */
export interface ProductOptionSelection {
  /** Option code. */
  readonly code: string;

  /** Option value. */
  readonly value: string;
}

/**
 * Product option — a configurable dimension of a product (e.g. size, color).
 */
export interface ProductOption {
  /** Option code. */
  readonly code: string;

  /** Display name of the option. */
  readonly label?: string;

  /** Selectable values for the option. */
  readonly values: readonly string[];
}

/**
 * Product variant projection.
 *
 * Represents product definition variations (e.g. size, color, model). It
 * carries no pricing or inventory — those belong to their owning modules.
 */
export interface ProductVariant {
  /** A unique identifier for the variant. */
  readonly id: string;

  /** The Stock Keeping Unit for the variant. */
  readonly sku?: string;

  /** Display name of the variant. */
  readonly name?: string;

  /** The attributes of the variant. */
  readonly attributes?: readonly ProductAttribute[];

  /** Selected option values for this variant. */
  readonly options?: readonly ProductOptionSelection[];

  /** Variant media. */
  readonly media?: readonly MediaModel[];
}

/**
 * Product projection.
 *
 * An immutable read-projection of the product domain. The catalog owns product
 * definition only: pricing, stock, shipping, and payment concerns are absent
 * by design.
 */
export interface ProductProjection {
  /** Unique product identifier. */
  readonly id: string;

  /** URL-friendly slug. */
  readonly slug?: string;

  /** Product URL. */
  readonly url?: string;

  /** Display name. */
  readonly name: string;

  /** Product description. */
  readonly description?: string;

  /** Product lifecycle status. */
  readonly status: ProductStatus;

  /** Product type metadata (application-defined). */
  readonly type?: ProductType;

  /** Identifier of the single product category. */
  readonly categoryId?: string;

  /** Free-form tags. */
  readonly tags?: readonly string[];

  /** Associated brand. */
  readonly brand?: BrandProjection;

  /** Product attributes. */
  readonly attributes?: readonly ProductAttribute[];

  /** Configurable product options. */
  readonly options?: readonly ProductOption[];

  /** Product variants. */
  readonly variants?: readonly ProductVariant[];

  /** Product media. */
  readonly media?: readonly MediaModel[];

  /** Creation timestamp. */
  readonly createdAt?: Date;

  /** Last update timestamp. */
  readonly updatedAt?: Date;
}

/**
 * Input contract for creating a product.
 */
export interface ProductCreate {
  /** Unique product identifier. */
  readonly id: string;

  /** Display name. */
  readonly name: string;

  /** URL-friendly slug. */
  readonly slug?: string;

  /** Product URL. */
  readonly url?: string;

  /** Product description. */
  readonly description?: string;

  /** Product lifecycle status; defaults to `draft`. */
  readonly status?: ProductStatus;

  /** Product type metadata (application-defined). */
  readonly type?: ProductType;

  /** Identifier of the single product category. */
  readonly categoryId?: string;

  /** Free-form tags. */
  readonly tags?: readonly string[];

  /** Associated brand. */
  readonly brand?: BrandProjection;

  /** Product attributes. */
  readonly attributes?: readonly ProductAttribute[];

  /** Configurable product options. */
  readonly options?: readonly ProductOption[];

  /** Product variants. */
  readonly variants?: readonly ProductVariant[];

  /** Product media. */
  readonly media?: readonly MediaModel[];

  /** Creation timestamp. */
  readonly createdAt?: Date;

  /** Last update timestamp. */
  readonly updatedAt?: Date;
}
