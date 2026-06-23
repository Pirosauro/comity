/**
 * Generic search pagination details.
 */
export interface SearchResultPageInfo {
  /** Current page number in the result set. */
  readonly current_page?: number;

  /** Number of items requested per page. */
  readonly page_size?: number;

  /** Total number of pages available. */
  readonly total_pages?: number;
}

/**
 *  Product discount values.
 */
export interface Discount {
  /** Absolute discount amount for the product. */
  readonly amount_off?: number;

  /** Discount percent off for the product. */
  readonly percent_off?: number;
}

/**
 * Monetary amount with currency code.
 */
export interface Money {
  /** Currency code in ISO format. */
  readonly currency?: string;

  /** Numeric amount value. */
  readonly value?: number;
}

/** Price discount data used by product price ranges. */
export interface Price {
  /** Product price discount for this price. */
  readonly discount?: Discount;

  /** Final product price after discounts. */
  readonly final_price?: Money;

  /** Fixed product taxes that can be applied to the price. */
  readonly fixed_product_taxes?: ReadonlyArray<{
    /** Tax amount. */
    amount?: Money;

    /** Tax label. */
    label?: string;
  }>;

  /** Regular product price before discounts. */
  readonly regular_price?: Money;
}

/** Product price range from minimum to maximum. */
export interface PriceRange {
  /** Maximum price in the range. */
  readonly maximum_price?: Price;

  /** Minimum price in the range. */
  readonly minimum_price?: Price;
}

/** URL rewrite details for product/category routes. */
export interface UrlRewrite {
  /** Request parameters for the rewrite. */
  readonly parameters?: ReadonlyArray<{
    /** Parameter name. */
    name?: string;

    /** Parameter value. */
    value?: string;
  }>;

  /** Request URL. */
  readonly url?: string;
}

/**
 * Media gallery item representing a product image or video.
 */
export interface MediaGallery {
  /** Indicates whether the media is hidden from view. */
  readonly disabled?: boolean;

  /** Label or alt-text for the media item. */
  readonly label?: string;

  /** Position of the media item in the gallery. */
  readonly position?: number;

  /** URL to the media resource. */
  readonly url?: string;
}
