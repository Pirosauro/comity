import type { GraphqlNode, GraphqlRoot, GraphqlValue } from "./contracts/graphql.js";
import type { GraphqlValueSerializer } from "./contracts/serializer.js";

import { isObject } from "./internal/is-object.js";
import { defaultSerializeValue } from "./serializers/default.js";

/**
 * Options for building a GraphQL query, including indentation and value serialization settings.
 */
export interface BuildQueryOptions {
  /**  */
  indent?: number | false;

  /**  */
  serializeValue?: GraphqlValueSerializer;
}

/**
 * Builds a GraphQL query string from a given GraphqlRoot object, with optional formatting and value serialization.
 *
 * @param root - The root node of the GraphQL query, containing the operation type, name, variables, and fields.
 * @param options - Optional settings for query formatting and value serialization.
 *
 * @returns The generated GraphQL query string.
 */
export function buildQuery<T = unknown>(root: GraphqlRoot<T>, options?: BuildQueryOptions): string {
  const indent = options?.indent ?? 2;
  const serialize = options?.serializeValue ?? defaultSerializeValue;
  const nl = !indent ? " " : "\n";

  /**
   * Generates a string of spaces for indentation based on the current level.
   *
   * @param level - The current indentation level.
   *
   * @returns A string of spaces for indentation, or an empty string if indent is false.
   */
  const space = (level: number) => (!indent ? "" : " ".repeat(level * indent));

  /**
   * Serializes GraphQL argument values, handling primitives, arrays, objects, and variable references.
   *
   * @param args - The arguments to serialize.
   *
   * @returns The serialized arguments as a string, formatted for GraphQL queries.
   */
  function serializeArgs(args?: Record<string, GraphqlValue>): string {
    if (!args) return "";

    const entries = Object.entries(args);

    if (entries.length === 0) return "";

    return `(${entries.map(([k, v]) => `${k}: ${serialize(v)}`).join(", ")})`;
  }

  /**
   * Recursively parses a GraphQL node to generate the query string, handling fields, nested nodes, and arguments.
   *
   * @param node - The GraphQL node to parse.
   * @param level - The current indentation level for formatting the output.
   *
   * @returns The generated query string for the given node and its children, properly formatted with indentation and newlines.
   */
  function parseNode(node: Record<string, unknown>, level: number): string {
    const lines: string[] = [];

    for (const [key, value] of Object.entries(node)) {
      if (key.startsWith("$")) continue;

      if (!value) continue;

      // field
      if (value === true) {
        lines.push(`${space(level)}${key}`);

        continue;
      }

      // node
      if (isObject(value)) {
        const v = value as GraphqlNode<unknown>;
        const args = serializeArgs(v.$args);
        const sub = Object.keys(v).filter((k) => !k.startsWith("$"));

        if (sub.length === 0) {
          lines.push(`${space(level)}${key}${args}`);
        } else {
          const inner = parseNode(v, level + 1);

          lines.push(`${space(level)}${key}${args} {${nl}${inner}${nl}${space(level)}}`);
        }

        continue;
      }
    }

    return lines.join(nl);
  }

  const type = root.$type ?? "query";
  const name = root.$name ? ` ${root.$name}` : "";
  const vars =
    root.$vars && Object.keys(root.$vars).length > 0
      ? `(${Object.entries(root.$vars)
          .map(([k, v]) => `${k}: ${v}`)
          .join(", ")})`
      : "";
  const body = parseNode(root as Record<string, unknown>, 1);

  return `${type}${name}${vars} {${nl}${body}${nl}}`.trim();
}
