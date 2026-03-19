export type Unarray<T> = T extends (infer U)[] ? U : T;

export type ScalarKeys<T> = {  
  [K in keyof T]: Unarray<NonNullable<T[K]>> extends object ? never : K  
}[keyof T];

export type ObjectKeys<T> = Extract<Exclude<keyof T, ScalarKeys<T>>, string>;

/**
 * GraphQL Directive definition.
 */
export interface Directive {
  name: string;
  args?: { [key: string]: string };
}

/**
 * A union of all node types in our query AST.
 */
export type FieldNode = FieldLeaf | FieldObject | FragmentSpread | InlineFragment;

/**
 * A simple field (leaf) with an optional alias, arguments, and directives.
 */
export interface FieldLeaf {
  kind: "field";
  name: string;
  alias?: string;
  args?: { [key: string]: string };
  directives?: Directive[];
}

/**
 * A nested object field with optional arguments, alias, and directives.
 */
export interface FieldObject {
  kind: "object";
  name: string;
  alias?: string;
  args?: { [key: string]: string };
  directives?: Directive[];
  fields: FieldNode[];
}

/**
 * A fragment spread (external fragment) with optional directives.
 */
export interface FragmentSpread {
  kind: "fragment";
  name: string;
  directives?: Directive[];
}

/**
 * An inline fragment with a type condition and optional directives.
 */
export interface InlineFragment {
  kind: "inlineFragment";
  type: string;
  directives?: Directive[];
  fields: FieldNode[];
}

/**
 * A fragment definition.
 */
export interface FragmentDefinition {
  name: string;
  type: string;
  fields: FieldNode[];
  directives?: Directive[];
}

/**
 * Variable definition with type and optional default value.
 */
export interface VariableDefinition {
  type: string;
  defaultValue?: string;
}

/**
 * Interface for a GraphQL edge.
 */
export interface Edge {
  cursor: string;
  node: any;
}

/**
 * Interface for a GraphQL connection.
 */
export interface Connection<T = any> {
  edges: Edge[];
  nodes: T[];
  pageInfo: any;
}