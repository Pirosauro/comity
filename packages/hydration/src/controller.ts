import type { IslandElement } from "./client/island-element.js";
import type { HydrationSchedulingAdapter } from "./contracts/hydration-scheduler.js";
import type { IslandHydrationAdapter } from "./contracts/island-hydrator.js";
import type { HydrationRuntimeObserver } from "./lifecycle/runtime.js";

import { DefaultHydrationScheduler } from "./internal/scheduler-adapter.js";

/**
 * Hydration Controller Options
 */
export interface HydrationControllerOptions {
  /**
   * The island hydrator adapter
   */
  hydrator: IslandHydrationAdapter;

  /**
   * The hydration scheduler adapter
   */
  scheduler?: HydrationSchedulingAdapter;

  /**
   * The hydration runtime observer
   */
  observer?: HydrationRuntimeObserver;
}

/**
 * Hydration Controller
 */
export class HydrationController {
  /** */
  readonly #hydrator: IslandHydrationAdapter;

  /**  */
  readonly #scheduler: HydrationSchedulingAdapter;

  /**  */
  readonly #observer: HydrationRuntimeObserver | undefined;

  /**
   * @param options - The hydration controller options
   */
  constructor(options: HydrationControllerOptions) {
    this.#hydrator = options.hydrator;
    this.#scheduler = options.scheduler ?? new DefaultHydrationScheduler();
    this.#observer = options.observer;
  }

  /**
   *
   * @param island
   */
  onDiscovered(island: IslandElement): void {
    const contract = island.contract;

    // 1. Validate contract
    if (!contract) {
      // Emit hydration failed event
      this.#observer?.onIslandHydrationFailed?.({
        reason: "invalid_contract",
        duration: 0,
      });

      return;
    }

    const { id, strategy } = contract;

    // Emit discovery event
    this.#observer?.onIslandDiscovered?.({ id, strategy });

    // 2. Schedule hydration
    this.#scheduler.schedule(island, async () => {
      this.#observer?.onIslandScheduled?.({ id, strategy });
      this.#observer?.onIslandHydrationStarted?.({ id });

      // 3. Start hydration
      const start = window.performance.now();

      try {
        // 3.1 Registry / adapter validation
        if (!this.#hydrator.supports(contract)) {
          this.#observer?.onIslandHydrationFailed?.({
            id,
            reason: "not_registered",
            duration: window.performance.now() - start,
          });

          return;
        }

        // 3.2 Perform hydration
        await this.#hydrator.hydrate(island, contract);

        // Emit hydration completed event
        this.#observer?.onIslandHydrationCompleted?.({
          id,
          duration: window.performance.now() - start,
        });
      } catch (error) {
        // Emit hydration failed event
        this.#observer?.onIslandHydrationFailed?.({
          id,
          reason: "hydrate_failed",
          duration: window.performance.now() - start,
        });
      }
    });
  }
}
