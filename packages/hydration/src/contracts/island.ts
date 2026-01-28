import type { HydrationStrategy } from "./strategy.js";

/**
 * Island contract
 */
export interface IslandContract<Data = unknown> {
  /** Island unique identifier */
  id: string;

  /** Island unique component name */
  component: string;

  /** Hydration data */
  data: Data;

  /** Hydration strategy */
  strategy: HydrationStrategy;

  /** Hydration mode */
  mode?: "client-only";
}

/**
 * Island hydration state
 */
export type IslandHydrationState =
  | "idle" // Initial state
  | "materialized" // The server HTML has been materialized
  | "hydrating" // Hydration is in progress
  | "completed" // Hydration completed successfully
  | "failed"; // Hydration failed
