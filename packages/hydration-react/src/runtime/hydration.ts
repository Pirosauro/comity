import type { HydrationRuntimeEvents } from "@comity/hydration/lifecycle";
import type { IslandComponentRegistry } from "../contracts/registry.js";

import { HydrationController } from "@comity/hydration";
import { DomIslandDiscoveryAdapter } from "../internal/discoverer.js";
import { ReactIslandHydrationAdapter } from "../internal/hydrator.js";

/**
 *
 */
export type HydrationRuntimeOptions = {
  /** Root DOM node to scan */
  root: ParentNode;

  /** Island component loaders */
  islands: IslandComponentRegistry;

  /** */
  emitter?: HydrationRuntimeEvents;
};

/**
 *
 * @param options - The hydration runtime options
 */
export function createHydrationRuntime(options: HydrationRuntimeOptions) {
  // 1. Executor (framework-specific)
  const hydrator = new ReactIslandHydrationAdapter(options.islands);

  // 2. Controller (pure orchestration)
  const controller = new HydrationController({
    hydrator,
    ...(options.emitter ? { emitter: options.emitter } : {}),
  });

  // 3. Discovery adapter (DOM)
  const discovery = new DomIslandDiscoveryAdapter(options.root, (island) => {
    controller.onDiscovered(island);
  });

  // 4. Attach discovery
  discovery.attach();
}
