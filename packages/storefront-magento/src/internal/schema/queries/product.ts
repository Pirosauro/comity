import { z } from "zod";
import {
  FilterEqualTypeInputSchema,
  FilterRangeTypeInputSchema,
  GraphQLIntSchema,
} from "../common.js";

/**
 * Validates product filter attributes used by Magento search.
 */
export const ProductAttributeFilterInputSchema = z
  .object({
    /** Filter product by the unique ID for a `CategoryInterface` object. */
    category_uid: FilterEqualTypeInputSchema,

    /** Filter by product price range values. */
    price: FilterRangeTypeInputSchema,

    /** Filter by product SKU value. */
    sku: FilterEqualTypeInputSchema,

    /** Filter by product URL key value. */
    url_key: FilterEqualTypeInputSchema,
  })
  .optional();

/**
 * Inferred input type for product attribute filtering.
 */
export type ProductAttributeFilterInput = z.infer<typeof ProductAttributeFilterInputSchema>;

/**
 * Validates variables for the products query.
 */
export const ProductsQueryInputSchema = z
  .object({
    /** Requested page number for product results. */
    currentPage: GraphQLIntSchema.optional(),

    /** Product attribute filters applied to search. */
    filter: ProductAttributeFilterInputSchema,

    /** Requested page size for product results. */
    pageSize: GraphQLIntSchema.optional(),

    /** Full text search term for products. */
    search: z.string().optional(),

    /** Product sort definition by attributes. */
    sort: z.record(z.string(), z.enum(["ASC", "DESC"])).optional(),
  })
  .optional();

/**
 * Inferred input type for products query variables.
 */
export type ProductsQueryInput = z.infer<typeof ProductsQueryInputSchema>;
