import type { GraphqlValue } from "./graphql.js";

/**
 *
 */
export type GraphqlValueSerializer = (value: GraphqlValue) => string;
