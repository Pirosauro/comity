/**
 *
 */
export type GraphqlOperationType = "query" | "mutation" | "subscription";

/**
 *
 */
export type GraphqlPrimitive = string | number | boolean | null | undefined;

/**
 *
 */
export type GraphqlValue =
  | GraphqlPrimitive
  | GraphqlValue[]
  | { [key: string]: GraphqlValue }
  | GraphqlVar;

/**
 * Variable reference
 */
export interface GraphqlVar {
  /**  */
  readonly __var: string;
}

/**
 * Utility type to extract the keys of an object type that are not functions or symbols, used for defining valid field selections in GraphQL queries.
 */
export type GraphqlFieldKeys<T> = {
  [K in keyof T]: T[K] extends Function ? never : K extends symbol ? never : K;
}[keyof T];

/**
 * Utility type to extract the element type from an array type T, returning the element type if T is an array, or T itself if it is not an array.
 */
type ElementType<T> = T extends (infer U)[] ? U : T;

/**
 * Recursive utility type to define a type-safe GraphQL selection set for a given type T.
 */
export type GraphqlNode<T> = {
  [P in GraphqlFieldKeys<ElementType<T>>]?: ElementType<T>[P] extends object
    ? GraphqlNode<ElementType<T>[P]> | boolean
    : boolean;
} & {
  /**
   * Optional arguments for the GraphQL selection, allowing you to specify variables or literal values for the fields.
   */
  $args?: Record<string, GraphqlValue>;
};

/**
 *
 */
export type GraphqlRoot<T> = {
  /**  */
  $type?: GraphqlOperationType;

  /**  */
  $name?: string;

  /**  */
  $vars?: Record<string, string>;
} & GraphqlNode<T>;
