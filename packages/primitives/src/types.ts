/**
 * Primitive types in TypeScript.
 */
export type Primitive = string | number | boolean | symbol | bigint | null | undefined;

/**
 * Non-recursive object types.
 */
export type NonRecursiveObject =
  | ((...args: unknown[]) => unknown)
  | Date
  | RegExp
  | Map<unknown, unknown>
  | Set<unknown>
  | Promise<unknown>;

/**
 * Recursively makes all properties of an object type readonly.
 *
 * @remarks
 * This utility type is used to create deeply immutable types, ensuring that all nested properties of an object are also readonly. It handles primitive types, non-recursive objects, arrays, and regular objects.
 */
export type ReadonlyDeep<T> = T extends Primitive
  ? T
  : T extends NonRecursiveObject
    ? T
    : T extends (infer R)[]
      ? readonly ReadonlyDeep<R>[]
      : T extends object
        ? { readonly [key in keyof T]: ReadonlyDeep<T[key]> }
        : T;
