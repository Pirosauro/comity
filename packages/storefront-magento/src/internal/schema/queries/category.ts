import { z } from "zod";
import { FilterEqualTypeInputSchema, GraphQLIntSchema } from "../common.js";

/**
 * Validates category filter attributes used by Magento search.
 */
export const MagentoGraphqlCategoryFilterInputSchema = z
  .object({
    /** Filter by the unique category ID for a `CategoryInterface` object. */
    category_uid: FilterEqualTypeInputSchema,

    /** Filter by the unique parent category ID for a `CategoryInterface` object. */
    parent_category_uid: FilterEqualTypeInputSchema,

    /** Filter by the part of the URL that identifies the category. */
    url_key: FilterEqualTypeInputSchema,

    /** Filter by the URL path for the category. */
    url_path: FilterEqualTypeInputSchema,
  })
  .optional();

/**
 * Inferred input type for category attribute filtering.
 */
export type MagentoGraphqlCategoryFilterInput = z.infer<
  typeof MagentoGraphqlCategoryFilterInputSchema
>;

/**
 * Validates variables for the categories query.
 */
export const MagentoGraphqlCategoryQueryInputSchema = z
  .object({
    /** Requested page number for category results. */
    currentPage: GraphQLIntSchema.optional(),

    /** Category filters applied to search. */
    filters: MagentoGraphqlCategoryFilterInputSchema,

    /** Requested page size for category results. */
    pageSize: GraphQLIntSchema.optional(),
  })
  .optional();

/**
 * Inferred input type for categories query variables.
 */
export type MagentoGraphqlCategoryQueryInput = z.infer<
  typeof MagentoGraphqlCategoryQueryInputSchema
>;
