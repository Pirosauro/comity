import type { GraphqlVar } from "../contracts/graphql.js";

import { isObject } from "./is-object.js";

/**
 * Checks if a value is a GraphQL variable reference.
 *
 * @param value - The value to check.
 *
 * @returns True if the value is a GraphQL variable reference, false otherwise.
 */
export function isVar(value: unknown): value is GraphqlVar {
  return isObject(value) && "__var" in value;
}
