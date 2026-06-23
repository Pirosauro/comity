import { z } from "zod";

/**
 * Shared schema for GraphQL identifier values.
 */
export const GraphQLIDSchema = z.string();

/**
 * Shared schema for GraphQL integer values.
 */
export const GraphQLIntSchema = z.number().int();

/**
 * Shared schema for GraphQL float values.
 */
export const GraphQLFloatSchema = z.number();

/**
 * Shared schema for equal filter inputs.
 */
export const FilterEqualTypeInputSchema = z
  .object({
    /** Filter value to compare with equality. */
    eq: z.string().optional(),

    /** Multiple values to compare with inclusion. */
    in: z.array(z.string()).optional(),
  })
  .optional();

/**
 * Shared schema for match filter inputs.
 */
export const FilterMatchTypeInputSchema = z
  .object({
    /** Match value for text search. */
    match: z.string().optional(),
  })
  .optional();

/**
 * Shared schema for range filter inputs.
 */
export const FilterRangeTypeInputSchema = z
  .object({
    /** Lower bound for range filtering. */
    from: z.string().optional(),

    /** Upper bound for range filtering. */
    to: z.string().optional(),
  })
  .optional();
