import type { IslandElement } from "../client/island-element.js";
import type { HydrationSchedulingAdapter } from "../contracts/hydration-scheduler.js";
import type { IslandHydrationAdapter } from "../contracts/island-hydrator.js";
import type { HydrationRuntimeEvents } from "../lifecycle/runtime.js";

import { DefaultHydrationScheduler } from "../internal/scheduler-adapter.js";

/**
 *
 */
export interface HydrationControllerOptions {
  /**
   *
   */
  hydrator: IslandHydrationAdapter;

  /**
   *
   */
  scheduler?: HydrationSchedulingAdapter;

  /**
   *
   */
  emitter?: HydrationRuntimeEvents;
}

/**
 *
 */
export class HydrationController {
  /** */
  readonly #hydrator: IslandHydrationAdapter;

  /**  */
  readonly #scheduler: HydrationSchedulingAdapter;

  /**  */
  readonly #emitter: HydrationRuntimeEvents | undefined;

  /**
   * @param options - The hydration controller options
   */
  constructor(options: HydrationControllerOptions) {
    this.#hydrator = options.hydrator;
    this.#scheduler = options.scheduler ?? new DefaultHydrationScheduler();
    this.#emitter = options.emitter;
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
      this.#emitter?.islandHydrationFailed({
        reason: "invalid-contract",
        duration: 0,
      });

      return;
    }

    const { id, strategy } = contract;

    // Emit discovery event
    this.#emitter?.islandDiscovered({ id, strategy });

    // 2. Schedule hydration
    this.#scheduler.schedule(island, async () => {
      this.#emitter?.islandScheduled({ id, strategy });
      this.#emitter?.islandHydrationStarted({ id });

      // 3. Start hydration
      const start = window.performance.now();

      try {
        // 3.1 Registry / adapter validation
        if (!this.#hydrator.supports(contract)) {
          this.#emitter?.islandHydrationFailed({
            id,
            reason: "not-registered",
            duration: window.performance.now() - start,
          });

          return;
        }

        // 3.2 Perform hydration
        await this.#hydrator.hydrate(island, contract);

        // Emit hydration completed event
        this.#emitter?.islandHydrationCompleted({
          id,
          duration: window.performance.now() - start,
        });
      } catch (error) {
        // Emit hydration failed event
        this.#emitter?.islandHydrationFailed({
          id,
          reason: "hydrate-failed",
          duration: window.performance.now() - start,
        });
      }
    });
  }
}
