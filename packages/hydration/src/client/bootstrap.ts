import type { HydrationContext } from "./context.js";

import { ComityIslandElement } from "./element.js";
import { hydrateIslands } from "./hydrate.js";

/**
 *
 */
export function registerIslandElement(): void {
  if (!customElements.get("comity-island")) {
    customElements.define("comity-island", ComityIslandElement);
  }
}

/**
 * Creates the hydration runtime
 * 
 * @param ctx Hydration context
 * @returns Hydration runtime
 */
export function createHydrationRuntime(ctx: HydrationContext) {
  registerIslandElement();

  return {
    /**
     * Starts the hydration process
     */
    start() {
      hydrateIslands(ctx);
    },
  };
}