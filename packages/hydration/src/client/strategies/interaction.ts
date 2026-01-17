import type { IslandHydrationInteractionStrategy } from "../../contracts/island.js";
import type { ComityIslandElement } from "../element.js";

/**
 * Hydration strategy that hydrates an island upon user interaction
 *
 * @param events The user interaction events to listen for
 * @param elem The HTML element representing the island
 * @param run The function to run to perform hydration
 */
export function interaction(
  events: IslandHydrationInteractionStrategy["options"],
  elem: ComityIslandElement,
  run: () => Promise<void>,
): void {
  /**
   * Event handler for user interaction
   */
  const handler = () => {
    if (elem.hydrated) return;

    elem.hydrated = Date.now();

    cleanup();
    run();
  };

  /**
   * Cleans up event listeners
   */
  const cleanup = () => {
    events.forEach((event) => {
      elem.removeEventListener(event, handler);
    });
  };

  // Attach event listeners for the specified events
  events.forEach((event) => {
    elem.addEventListener(event, handler, { once: true });
  });
}
