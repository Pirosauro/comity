/**
 * Interaction strategy
 */
export type IslandHydrationInteractionStrategy = {
  /** Hydration strategy name */
  type: "interaction";

  /** Interaction events that trigger hydration */
  options: ("pointerdown" | "click" | "focusin")[];
};

/**
 * Media strategy
 */
export type IslandHydrationMediaStrategy = {
  /** Hydration strategy name */
  type: "media";

  /** Media query that triggers hydration */
  options: string;
};

/**
 * Other strategies
 */
export type IslandHydrationOtherStrategy = {
  /** Hydration strategy name */
  type: "immediate" | "idle" | "visible" | "never";

  /** Never has options */
  options?: never;
};

/**
 * Hydration strategy union type
 */
export type IslandHydrationStrategy =
  | IslandHydrationInteractionStrategy
  | IslandHydrationMediaStrategy
  | IslandHydrationOtherStrategy;

/**
 * Island contract
 */
export interface IslandContract<Data = unknown> {
  /** Island unique name */
  name: string;

  /** Hydration data */
  data: Data;

  /** Hydration strategy */
  strategy: IslandHydrationStrategy;
}
