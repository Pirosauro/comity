import type { MediaModel } from "@comity/media";
import type { InventoryModel } from "./inventory.js";
import type { PriceModel } from "./price.js";

/**
 * Product price information.
 */
export interface ProductAttributeModel {
  /** A unique identifier for the attribute. */
  readonly code: string;

  /** The display name of the attribute. */
  readonly label?: string;

  /** The value of the attribute. */
  readonly value: string | number | boolean;
}

/**
 * Product variant model.
 */
export interface ProductVariantModel {
  /** A unique identifier for the variant. */
  readonly id: string;

  /** The Stock Keeping Unit for the variant. */
  readonly sku?: string;

  /** The attributes of the variant. */
  readonly options: ReadonlyArray<ProductAttributeModel>;

  /** The price information of the variant. */
  readonly price?: PriceModel;

  /** The inventory information of the variant. */
  readonly inventory?: InventoryModel;

  /** Variant images. */
  readonly images?: ReadonlyArray<MediaModel>;
}

/**
 * Product model.
 */
export interface ProductModel {
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

  /** Product images. */
  readonly images?: ReadonlyArray<MediaModel>;

  /** Product variants. */
  readonly variants: ReadonlyArray<ProductVariantModel>;

  /** Product attributes */
  readonly attributes?: ReadonlyArray<ProductAttributeModel>;

  /** Creation timestamp. */
  readonly createdAt?: Date;

  /** Last update timestamp. */
  readonly updatedAt?: Date;
}
