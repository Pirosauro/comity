import type { GraphqlValue } from "../contracts/graphql.js";

import { isObject } from "../internal/is-object.js";
import { isVar } from "../internal/is-var.js";

/**
 * Default serializer for GraphQL values, handling primitives, arrays, objects, and variable references.
 *
 * @param value - The value to serialize.
 *
 * @returns The serialized GraphQL value as a string.
 */
export function defaultSerializeValue(value: GraphqlValue): string {
  // Handle variable references
  if (isVar(value)) {
    return `$${value.__var}`;
  }

  // Handle strings with JSON.stringify to ensure proper escaping
  if (typeof value === "string") {
    return JSON.stringify(value);
  }

  // Handle numbers and booleans as-is
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  // Handle null and undefined as "null" in GraphQL
  if (value === null || value === undefined) {
    return "null";
  }

  // Handle arrays by recursively serializing each element
  if (Array.isArray(value)) {
    return `[${value.map(defaultSerializeValue).join(", ")}]`;
  }

  // Handle objects by serializing each key-value pair
  if (isObject(value)) {
    const entries = Object.entries(value)
      .map(([k, v]) => `${k}: ${defaultSerializeValue(v as GraphqlValue)}`)
      .join(", ");

    return `{ ${entries} }`;
  }

  // Fallback for any other types (should not happen with GraphqlValue)
  return JSON.stringify(value);
}
