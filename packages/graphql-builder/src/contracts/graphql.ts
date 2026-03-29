/**
 * GraphQL operation definition
 */
export type GraphqlOperationType = "query" | "mutation" | "subscription";

/**
 * GraphQL primitive types
 */
export type GraphqlPrimitive = string | number | boolean | null | undefined;

/**
 * GraphQL value types, including primitives, arrays, objects, and variable references
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
 * Represents a selector for fields of a type, allowing for nested selection of fields in complex objects.
 */
export type GraphqlFieldsSelector<T> = {
  [K in keyof T]?: T[K] extends Array<infer U>
    ? boolean | GraphqlNode<NonNullable<U>>
    : T[K] extends object | undefined
      ? boolean | GraphqlNode<NonNullable<T[K]>>
      : boolean;
};

/**
 * Recursive utility type to define a type-safe GraphQL selection set for a given type T.
 */
export type GraphqlNode<T> = (T extends Array<infer U>
  ? GraphqlFieldsSelector<NonNullable<U>>
  : GraphqlFieldsSelector<T>) & {
  /** Permette gli argomenti a ogni livello del nodo */
  $args?: Record<string, GraphqlValue>;
};

/**
 * GraphQL operation definition
 */
export interface GraphqlOperation {
  /**  */
  $type?: GraphqlOperationType;

  /**  */
  $name?: string;

  /**  */
  $vars?: Record<string, string>;
}

/**
 * Complete GraphQL query definition
 */
export type GraphqlRoot<T> = GraphqlOperation & GraphqlNode<T>;
