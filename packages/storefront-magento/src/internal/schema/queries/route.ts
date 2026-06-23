import { z } from "zod";

/**
 * Validates variables for the route query.
 */
export const RouteQueryInputSchema = z.object({
  /** URL path to resolve in Magento route query. */
  url: z.string().min(1),
});

/**
 * Inferred input type for route query variables.
 */
export type RouteQueryInput = z.infer<typeof RouteQueryInputSchema>;
