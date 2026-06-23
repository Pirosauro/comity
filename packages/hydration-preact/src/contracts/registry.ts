import type { ComponentType } from "preact";

/**
 * Island loader type
 */
export type IslandComponentLoader = () => Promise<{
  /** Island hydrate function as default export */
  default: string | ComponentType;
}>;

/**
 *
 */
export type IslandComponentRegistry = Record<string, IslandComponentLoader>;
