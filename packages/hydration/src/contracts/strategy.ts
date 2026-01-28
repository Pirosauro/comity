/**
 * Interaction strategy
 */
export type HydrationInteractionStrategy = {
  /** Hydration strategy name */
  kind: "interaction";

  /** Interaction events that trigger hydration */
  options: ("pointerdown" | "click" | "focusin")[];
};

/**
 * Media strategy
 */
export type HydrationMediaStrategy = {
  /** Hydration strategy name */
  kind: "media";

  /** Media query that triggers hydration */
  options: string;
};

/**
 * Other strategies
 */
export type HydrationOtherStrategy = {
  /** Hydration strategy name */
  kind: "immediate" | "idle" | "visible" | "never";
};

/**
 * Hydration strategy union type
 */
export type HydrationStrategy =
  | HydrationInteractionStrategy
  | HydrationMediaStrategy
  | HydrationOtherStrategy;
