import type { IslandHydrationEvents } from "@comity/hydration";

import { createHydrationRuntime, HydrationContext, IslandRegistry } from "@comity/hydration/client";
import { EventBus } from "@comity/primitives/events";

// import { startHydration } from "./hydration/client.js";
// import { registerIsland } from "./hydration/registry.js";

// // register islands
// registerIsland("counter", Counter);

// // start hydration
// startHydration();

// Create the island registry
const registry = new IslandRegistry();

// Register islands
registry.register("counter", () => import("./components/counter.island.js"));

// Create the event bus and hydration context
const events = new EventBus<IslandHydrationEvents>();
const ctx = new HydrationContext({
  registry,
  events,
});

// Create the hydration runtime
const runtime = createHydrationRuntime(ctx);

// Start the hydration process
runtime.start();
