import type { DiContainer } from "@comity/core/di";
import type { EventBus } from "@comity/core/events";
import type { HookBus } from "@comity/core/hooks";

import { KernelInvalidStateError } from "./errors/invalid-state.js";
import { Lifecycle } from "./lifecycle.js";

/**
 * Kernel configuration options
 */
export type KernelConfig = {
  /** */
  services: DiContainer;

  /** */
  events: EventBus;

  /** */
  hooks: HookBus;
};

/**
 * Kernel class
 */
export class Kernel {
  /** Service container */
  #services;

  /** Event bus */
  #events;

  /** Hook bus */
  #hooks;

  /** Lifecycle manager */
  #lifecycle = new Lifecycle();

  /**
   * @param config Kernel configuration options
   */
  constructor(config: KernelConfig) {
    this.#services = config.services;
    this.#events = config.events;
    this.#hooks = config.hooks;
  }

  /**
   * @returns DiContainer compatible instance
   */
  get services(): Omit<DiContainer, "#private"> {
    return {
      /**
       * @param {...Parameters<DiContainer["define"]>} args DiContainer.define parameters
       * @returns DiContainer.define return value
       */
      define: (...args: Parameters<DiContainer["define"]>) => {
        this.assertNotSealed("service.define");

        return this.#services.define(...args);
      },

      /**
       * @param {...Parameters<DiContainer["resolve"]>} args DiContainer.resolve parameters
       * @returns DiContainer.resolve return value
       */
      resolve: (...args: Parameters<DiContainer["resolve"]>) => {
        this.assertSealed("service.resolve");

        return this.#services.resolve(...args);
      },
    };
  }

  /**
   * @returns EventBus compatible instance
   */
  get events(): Omit<EventBus, "#private"> {
    return {
      /**
       * @param {...Parameters<EventBus["subscribe"]>} args EventBus.subscribe parameters
       * @returns EventBus.subscribe return value
       */
      subscribe: (...args: Parameters<EventBus["subscribe"]>) => {
        this.assertNotSealed("event.subscribe");

        return this.#events.subscribe(...args);
      },

      /**
       * @param {...Parameters<EventBus["emit"]>} args EventBus.emit parameters
       * @returns EventBus.emit return value
       */
      emit: (...args: Parameters<EventBus["emit"]>) => {
        this.assertSealed("event.emit");

        return this.#events.emit(...args);
      },
    };
  }

  /**
   * @returns HookBus compatible instance
   */
  get hooks(): Omit<HookBus, "#private"> {
    return {
      /**
       * @param {...Parameters<HookBus["define"]>} args HookBus.define parameters
       * @returns HookBus.define return value
       */
      define: (...args: Parameters<HookBus["define"]>) => {
        this.assertNotSealed("hook.define");

        return this.#hooks.define(...args);
      },

      /**
       * @param {...Parameters<HookBus["execute"]>} args HookBus.execute parameters
       * @returns HookBus.execute return value
       */
      execute: (...args: Parameters<HookBus["execute"]>) => {
        this.assertSealed("hook.execute");

        return this.#hooks.execute(...args);
      },
    };
  }

  /**
   * Seal the kernel
   *
   * @remarks
   * Sealing the kernel transitions it to a state where services can be resolved,
   * events can be emitted, and hooks can be executed. After sealing, no further
   * modifications to services, events, or hooks are allowed.
   *
   * @returns Result of the lifecycle seal operation
   */
  seal(): ReturnType<Lifecycle["seal"]> {
    return this.#lifecycle.seal();
  }

  /**
   * Assert that the kernel is not sealed
   *
   * @param action Action name
   * @throws {KernelInvalidStateError} If the kernel is sealed
   */
  private assertNotSealed(action: string): void {
    if (this.#lifecycle.is("sealed")) {
      throw new KernelInvalidStateError({
        action,
        state: this.#lifecycle.state,
      });
    }
  }

  /**
   * Assert that the kernel is sealed
   *
   * @param action Action name
   * @throws {KernelInvalidStateError} If the kernel is not sealed
   */
  private assertSealed(action: string): void {
    if (!this.#lifecycle.is("sealed")) {
      throw new KernelInvalidStateError({
        action,
        state: this.#lifecycle.state,
      });
    }
  }
}
