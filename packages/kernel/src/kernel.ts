import type { DiContainer } from "@comity/core/di";
import type { EventBus } from "@comity/core/events";
import type { HookBus } from "@comity/core/hooks";
import type { ModuleSetupContext } from "./types.js";

import { KernelInvalidStateError } from "./errors/kernel-invalid-state.js";
import { Lifecycle } from "./lifecycle.js";

/**
 * Kernel configuration options
 */
export type KernelConfig<
  Services extends Record<string | symbol, unknown> = Record<
    string | symbol,
    unknown
  >,
  Events extends Record<string, unknown> = Record<string, unknown>,
  Hooks extends Record<string, unknown> = Record<string, unknown>,
> = {
  /** */
  services: DiContainer<Services>;

  /** */
  events: EventBus<Events>;

  /** */
  hooks: HookBus<Hooks>;
};

/**
 * Kernel class
 */
export class Kernel<
  Services extends Record<string | symbol, unknown> = Record<
    string | symbol,
    unknown
  >,
  Events extends Record<string, unknown> = Record<string, unknown>,
  Hooks extends Record<string, unknown> = Record<string, unknown>,
> {
  /** Service container */
  #services: Omit<DiContainer, "#private">;

  /** Event bus */
  #events: Omit<EventBus, "#private">;

  /** Hook bus */
  #hooks: Omit<HookBus, "#private">;

  /** Lifecycle manager */
  #lifecycle = new Lifecycle();

  /**
   * @param config Kernel configuration options
   */
  constructor(config: KernelConfig<Services, Events, Hooks>) {
    // Services
    this.#services = {
      /**
       * @param {...Parameters<typeof config.services.define>} args DiContainer.define parameters
       * @returns DiContainer.define return value
       */
      define: (...args: Parameters<typeof config.services.define>) => {
        this.assertNotSealed("service.define");

        return config.services.define(...args);
      },

      /**
       * @param {...Parameters<typeof config.services.resolve>} args DiContainer.resolve parameters
       * @returns DiContainer.resolve return value
       */
      resolve: (...args: Parameters<typeof config.services.resolve>) => {
        this.assertSealed("service.resolve");

        return config.services.resolve(...args);
      },
    };

    // Events
    this.#events = {
      /**
       * @param {...Parameters<typeof config.events.subscribe>} args EventBus.subscribe parameters
       * @returns EventBus.subscribe return value
       */
      subscribe: (...args: Parameters<typeof config.events.subscribe>) => {
        this.assertNotSealed("event.subscribe");

        return config.events.subscribe(...args);
      },

      /**
       * @param {...Parameters<typeof config.events.emit>} args EventBus.emit parameters
       * @returns EventBus.emit return value
       */
      emit: (...args: Parameters<typeof config.events.emit>) => {
        this.assertSealed("event.emit");

        return config.events.emit(...args);
      },
    };

    // Hooks
    this.#hooks = {
      /**
       * @param {...Parameters<typeof config.hooks.define>} args HookBus.define parameters
       * @returns HookBus.define return value
       */
      define: (...args: Parameters<typeof config.hooks.define>) => {
        this.assertNotSealed("hook.define");

        return config.hooks.define(...args);
      },

      /**
       * @param {...Parameters<typeof config.hooks.execute>} args HookBus.execute parameters
       * @returns HookBus.execute return value
       */
      execute: (...args: Parameters<typeof config.hooks.execute>) => {
        this.assertSealed("hook.execute");

        return config.hooks.execute(...args);
      },
    };
  }

  /**
   * @returns DiContainer compatible instance
   */
  get services() {
    return this.#services;
  }

  /**
   * @returns EventBus compatible instance
   */
  get events() {
    return this.#events;
  }

  /**
   * @returns HookBus compatible instance
   */
  get hooks() {
    return this.#hooks;
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

  /**
   * Create a module context
   *
   * @returns Module context
   *
   * @remarks
   * This method creates and returns a context object that can be used
   * during module setup. The context includes access to the services container,
   * event bus, and hook bus of the kernel.
   *
   * Why is this method needed?
   * This method encapsulates the creation of the module setup context,
   * ensuring that the context is constructed consistently and correctly
   * whenever it is needed. It provides a clear and centralized way to
   * obtain the necessary components for module setup, promoting code
   * reuse and maintainability.
   */
  createModuleSetupContext(): ModuleSetupContext {
    return {
      services: this.services,
      events: this.events,
      hooks: this.hooks,
    };
  }
}
