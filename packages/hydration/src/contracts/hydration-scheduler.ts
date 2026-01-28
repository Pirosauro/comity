import type { IslandElement } from "../client/island-element.js";

/**
 * Scheduler adapter contract.
 */
export interface HydrationSchedulingAdapter {
  /**
   * Schedules the hydration of the given island based on its strategy.
   *
   * @param island The island state to schedule for hydration.
   *
   * @returns A promise that resolves when the scheduling is complete.
   */
  schedule(island: IslandElement, run: () => Promise<void>): void;
}
