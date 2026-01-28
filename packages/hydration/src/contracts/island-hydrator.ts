import type { IslandElement } from "../client/island-element.js";
import type { IslandContract } from "./island.js";

/**
 * Island loader contract.
 */
export interface IslandHydrationAdapter {
  /**
   * Determines if the adapter supports hydrating the given island.
   *
   * @param contract The island contract to check.
   *
   * @returns True if the adapter supports the island; otherwise, false.
   */
  supports(contract: IslandContract): boolean;

  /**
   * Hydrates the given island according to the provided contract.
   *
   * @param island The island element to hydrate.
   * @param contract The island contract to use for hydration.
   *
   * @returns A promise that resolves when hydration is complete.
   */
  hydrate(island: IslandElement, contract: IslandContract): Promise<void>;
}
