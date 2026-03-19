/**
 * @comity/graphql-builder
 * Zero-dependency GraphQL query builder for TypeScript.
 * Designed for Edge runtimes and explicit architecture.
 */

/**
 *
 */
export type GQLOperationType = "query" | "mutation" | "subscription";

/* ============================================================
 * Values
 * ============================================================
 */

/**
 *
 */
export type GQLPrimitive = string | number | boolean | null | undefined;

/**
 *
 */
export type GQLValue = GQLPrimitive | GQLValue[] | { [key: string]: GQLValue } | GQLVarRef;

/**
 * Variable reference
 */
export interface GQLVarRef {
  /**
   *
   */
  readonly __var: string;
}

/**
 * Helper to create variable reference
 * @param name
 */
export function varRef(name: string): GQLVarRef {
  return { __var: name };
}

/* ============================================================
 * Node types
 * ============================================================
 */

/**
 *
 */
export type GQLField = true | GQLNode;

/**
 *
 */
export interface GQLNode {
  /**
   *
   */
  $args?: Record<string, GQLValue>;
  [key: string]: GQLField | unknown;
}

/**
 *
 */
export interface GQLRoot extends GQLNode {
  /**
   *
   */
  $type?: GQLOperationType;
  /**
   *
   */
  $name?: string;
  /**
   *
   */
  $vars?: Record<string, string>;
}

/* ============================================================
 * Options
 * ============================================================
 */

/**
 *
 */
export interface BuildQueryOptions {
  /**
   *
   */
  indent?: number | false;

  /**
   *
   */
  serializeValue?: (value: GQLValue) => string;
}

/* ============================================================
 * Utils
 * ============================================================
 */

/**
 *
 * @param value
 */
function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 *
 * @param value
 */
function isVarRef(value: unknown): value is GQLVarRef {
  return isObject(value) && "__var" in value;
}

/* ============================================================
 * Default serializer
 * ============================================================
 */

/**
 *
 * @param value
 */
function defaultSerializeValue(value: GQLValue): string {
  if (isVarRef(value)) {
    return `$${value.__var}`;
  }

  if (typeof value === "string") {
    return JSON.stringify(value);
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  if (value === null) {
    return "null";
  }

  if (value === undefined) {
    return "null";
  }

  if (Array.isArray(value)) {
    return `[${value.map(defaultSerializeValue).join(", ")}]`;
  }

  if (isObject(value)) {
    const entries = Object.entries(value)
      .map(([k, v]) => `${k}: ${defaultSerializeValue(v as GQLValue)}`)
      .join(", ");

    return `{ ${entries} }`;
  }

  return JSON.stringify(value);
}

/* ============================================================
 * Builder
 * ============================================================
 */

/**
 *
 * @param root
 * @param options
 */
export function buildQuery(root: GQLRoot, options?: BuildQueryOptions): string {
  const indent = options?.indent ?? 2;
  const serialize = options?.serializeValue ?? defaultSerializeValue;

  const isMinified = indent === false || indent === 0;

  const nl = isMinified ? " " : "\n";

  /**
   *
   * @param level
   */
  const space = (level: number) => (isMinified ? "" : " ".repeat(level * (indent as number)));

  /**
   *
   * @param args
   */
  function serializeArgs(args?: Record<string, GQLValue>): string {
    if (!args) return "";

    const entries = Object.entries(args);

    if (entries.length === 0) return "";

    return `(${entries.map(([k, v]) => `${k}: ${serialize(v)}`).join(", ")})`;
  }

  /**
   *
   * @param node
   * @param level
   */
  function parseNode(node: GQLNode, level: number): string {
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
        const v = value as GQLNode;

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

  const body = parseNode(root, 1);

  return `${type}${name}${vars} {${nl}${body}${nl}}`.trim();
}
