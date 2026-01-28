import type { HydrationStrategy } from "../contracts/strategy";

/**
 *
 */
export interface HydrationRuntimeEvents {
  /** Discovery */
  islandDiscovered(payload: {
    /**  */
    id: string;

    /**  */
    strategy?: HydrationStrategy;
  }): void;

  /** Scheduling */
  islandScheduled(payload: {
    /**  */
    id: string;

    /**  */
    strategy: HydrationStrategy;
  }): void;

  /** Execution */
  islandHydrationStarted(payload: {
    /**  */
    id: string;
  }): void;

  /**
   *
   */
  islandHydrationCompleted(payload: {
    /**  */
    id: string;

    /**  */
    duration: number;
  }): void;

  /**
   *
   */
  islandHydrationFailed(payload: {
    /**  */
    id?: string;

    /** Failure category */
    reason: "invalid-contract" | "not-registered" | "hydrate-failed";

    /**  */
    duration: number;
  }): void;
}
