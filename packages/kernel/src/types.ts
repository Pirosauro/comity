/**
 * Token type.
 */
export type Token<T extends string, R> = symbol & {
  /** Token type string */
  __type: T;

  /** Higher-Order Type Mapping */
  __returnType: R;
};