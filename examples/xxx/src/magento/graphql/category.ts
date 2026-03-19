import { z } from "zod";

/**
 * GraphQL input schema for filtering categories.
 */
export const CategoryFilterInputSchema = z
  .object({
    category_uid: z
      .object({
        eq: z.string().optional(),
        in: z.array(z.string()).optional(),
      })
      .optional(),
    name: z
      .object({
        match: z.string().optional(),
        match_type: z.enum(["FULL", "PARTIAL"]).optional(),
      })
      .optional(),
    url_key: z
      .object({
        eq: z.string().optional(),
        in: z.array(z.string()).optional(),
      })
      .optional(),
    parent_category_uid: z
      .object({
        eq: z.string().optional(),
        in: z.array(z.string()).optional(),
      })
      .optional(),
  })
  .partial();

/**
 * GraphQL input schema for categories query.
 */
export const CategoriesQueryInputSchema = z.object({
  filters: CategoryFilterInputSchema.optional(),
  pageSize: z.number().min(1).max(200).default(20).optional(),
  currentPage: z.number().min(1).default(1).optional(),
});

/**
 * TypeScript type for categories query input, inferred from the schema.
 */
export type CategoriesQueryInput = z.infer<typeof CategoriesQueryInputSchema>;

/**
 *
 */
interface Breadcrumb {
  /** */
  category_level?: number;

  /**  */
  category_name?: string;

  /**  */
  category_uid: string;

  /**  */
  category_url_key?: string;

  /**  */
  category_url_path?: string;
}

/**
 *
 */
interface CategoryProductsPageInfo {
  /**  */
  current_page?: number;

  /**  */
  page_size?: number;

  /**  */
  total_pages?: number;
}

/**
 *
 */
interface CategoryProducts {
  /**  */
  items?: ProductSummary[];

  /**  */
  page_info?: CategoryProductsPageInfo;

  /**  */
  total_count?: number;
}

/**
 *
 */
interface ProductSummary {
  /**  */
  __typename?: string;

  /**  */
  uid: string;

  /**  */
  sku?: string;

  /**  */
  name?: string;

  /**  */
  price_range?: {
    /**  */
    minimum_price: {
      /**  */
      regular_price: {
        /**  */
        value: number;

        /**  */
        currency: string;
      };

      /**  */
      final_price: {
        /**  */
        value: number;
        /**  */
        currency: string;
      };
    };
  };

  /**  */
  stock_status?: "IN_STOCK" | "OUT_OF_STOCK";
}

/**
 *
 */
export interface CategoryNode {
  /**  */
  uid: string;

  /**  */
  id?: number; // deprecated

  /**  */
  name?: string;

  /**  */
  description?: string;

  /**  */
  url_key?: string;

  /**  */
  url_path?: string;

  /**  */
  url_suffix?: string;

  /**  */
  canonical_url?: string;

  /**  */
  meta_title?: string;

  /**  */
  meta_description?: string;

  /**  */
  meta_keywords?: string;

  /**  */
  level?: number;

  /**  */
  path?: string;

  /**  */
  path_in_store?: string;

  /**  */
  position?: number;

  /**  */
  breadcrumbs?: Breadcrumb[];

  /**  */
  children?: CategoryNode[];

  /**  */
  children_count?: number;

  /**  */
  product_count?: number;

  /**  */
  products?: CategoryProducts;

  /**  */
  include_in_menu?: number;

  /**  */
  is_anchor?: number;

  /**  */
  display_mode?: string;

  /** */
  image?: string;

  /**  */
  cms_block?: {
    /**  */
    identifier?: string;

    /**  */
    title?: string;

    /**  */
    content?: string;
  };
}

/**
 *
 */
export interface CategoriesResponse {
  /**  */
  categories: {
    /**  */
    items: CategoryNode[];

    /**  */
    page_info: {
      /**  */
      current_page: number;

      /**  */
      page_size: number;

      /**  */
      total_pages: number;
    };

    /**  */
    total_count: number;
  };
}
