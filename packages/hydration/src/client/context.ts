import type { EventBus } from "@comity/core/events";
import type { IslandHydrationEvents } from "../contracts/events.js";
import type { IslandRegistry } from "./registry.js";

/**
 * Hydration context options
 */
export type HydrationContextOptions = {
  /** The event bus */
  readonly events: EventBus<IslandHydrationEvents>;

  /** The island registry */
  readonly registry: IslandRegistry;
};

/**
 * Hydration context
 */
export class HydrationContext {
  /** Event bus */
  #events: EventBus<IslandHydrationEvents>;

  /** Island registry */
  #registry: IslandRegistry;

  /**
   * @param options The hydration context options
   * @param options.events The event bus
   * @param options.registry The island registry
   */
  constructor(options: HydrationContextOptions) {
    this.#events = options.events;
    this.#registry = options.registry;
  }

  /**
   * Event bus
   *
   * @returns EventBus
   */
  get events(): EventBus<IslandHydrationEvents> {
    return this.#events;
  }

  /**
   * Island registry
   *
   * @returns IslandRegistry
   */
  get registry(): IslandRegistry {
    return this.#registry;
  }
}
