import type { IslandComponentRegistry } from "@comity/hydration-react";

import { createHydrationRuntime } from "@comity/hydration-react";
import { registerIslandElement } from "@comity/hydration/client";

registerIslandElement();

// Create the island registry
const registry: IslandComponentRegistry = {
  /**
   *
   * @returns
   */
  // @ts-expect-error
  counter: () => import("./components/counter.js"),
  /**
   *
   */
  user: () => import("./components/user.island.js"),
};

// Create the hydration runtime
createHydrationRuntime({
  root: document,
  islands: registry,
});
