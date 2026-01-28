import type { ComponentClass, FunctionComponent } from "react";

/**
 * Island loader type
 */
export type IslandComponentLoader = () => Promise<{
  /** Island hydrate function as default export */
  default: string | FunctionComponent | ComponentClass;
}>;

/**
 *
 */
export type IslandComponentRegistry = Record<string, IslandComponentLoader>;
