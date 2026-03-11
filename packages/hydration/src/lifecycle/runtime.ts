import type { HydrationStrategy } from "../contracts/strategy.js";

/**
 * Events emitted by the hydration runtime
 */
export interface HydrationRuntimeObserver {
  /** Discovery */
  onIslandDiscovered(payload: {
    /** The unique identifier of the island */
    id: string;

    /** The hydration strategy for the island */
    strategy?: HydrationStrategy;
  }): void;

  /** Scheduling */
  onIslandScheduled(payload: {
    /** The unique identifier of the island */
    id: string;

    /** The hydration strategy for the island */
    strategy: HydrationStrategy;
  }): void;

  /** Execution */
  onIslandHydrationStarted(payload: {
    /** The unique identifier of the island */
    id: string;
  }): void;

  /** Completion */
  onIslandHydrationCompleted(payload: {
    /** The unique identifier of the island */
    id: string;

    /** The duration of the hydration process */
    duration: number;
  }): void;

  /** Failure */
  onIslandHydrationFailed(payload: {
    /** The unique identifier of the island */
    id?: string;

    /** Failure category */
    reason: "invalid_contract" | "not_registered" | "hydrate_failed";

    /** The duration of the hydration process */
    duration: number;
  }): void;
}
