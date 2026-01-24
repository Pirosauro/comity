import type { DiContainer } from "@comity/primitives/di";
import type { EventBus, HookBus } from "@comity/primitives/lifecycle";
import type { KernelEvents } from "./lifecycle/events.js";
import type { ModuleSetupContext } from "./types.js";

import { InvalidLifecycleStateError } from "./errors/invalid-lifecycle-state.js";
import { Lifecycle } from "./internal/lifecycle.js";

/**
 * Kernel context
 */
export type KernelContext<
  Services extends { [K in keyof Services]: unknown },
  Events extends { [K in keyof Events]: unknown },
  Hooks extends { [K in keyof Hooks]: unknown },
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
  Services extends { [K in keyof Services]: unknown },
  Events extends { [K in keyof Events]: unknown },
  Hooks extends { [K in keyof Hooks]: unknown },
> {
  /** Service container */
  #services: {
    /**  */
    define: DiContainer<Services>["define"];

    /**  */
    resolve: DiContainer<Services>["resolve"];
  };

  /** Event bus */
  #events: {
    /**  */
    subscribe: EventBus<Events>["subscribe"];

    /**  */
    emit: EventBus<Events>["emit"];
  };

  /** Hook bus */
  #hooks: {
    /**  */
    define: HookBus<Hooks>["define"];

    /**  */
    execute: HookBus<Hooks>["execute"];
  };

  /** Lifecycle manager */
  #lifecycle = new Lifecycle();

  /** Kernel events */
  #emitter: KernelEvents | undefined;

  /**
   * @param context Kernel context
   * @param emitter Kernel events emitter
   */
  constructor(context: KernelContext<Services, Events, Hooks>, emitter?: KernelEvents) {
    // Services
    this.#services = {
      /**
       * @param {...Parameters<typeof context.services.define>} args DiContainer.define parameters
       * @returns DiContainer.define return value
       */
      define: <K extends keyof Services>(
        ...args: Parameters<typeof context.services.define<K>>
      ) => {
        this.assertNotSealed("service.define");

        return context.services.define(...args);
      },

      /**
       * @param {...Parameters<typeof context.services.resolve>} args DiContainer.resolve parameters
       * @returns DiContainer.resolve return value
       */
      resolve: <K extends keyof Services>(
        ...args: Parameters<typeof context.services.resolve<K>>
      ) => {
        this.assertSealed("service.resolve");

        return context.services.resolve(...args);
      },
    };

    // Events
    this.#events = {
      /**
       * @param {...Parameters<typeof context.events.subscribe>} args EventBus.subscribe parameters
       * @returns EventBus.subscribe return value
       */
      subscribe: <K extends keyof Events>(
        ...args: Parameters<typeof context.events.subscribe<K>>
      ) => {
        this.assertNotSealed("event.subscribe");

        return context.events.subscribe(...args);
      },

      /**
       * @param {...Parameters<typeof context.events.emit>} args EventBus.emit parameters
       * @returns EventBus.emit return value
       */
      emit: <K extends keyof Events>(...args: Parameters<typeof context.events.emit<K>>) => {
        this.assertSealed("event.emit");

        return context.events.emit(...args);
      },
    };

    // Hooks
    this.#hooks = {
      /**
       * @param {...Parameters<typeof context.hooks.define>} args HookBus.define parameters
       * @returns HookBus.define return value
       */
      define: <K extends keyof Hooks>(...args: Parameters<typeof context.hooks.define<K>>) => {
        this.assertNotSealed("hook.define");

        return context.hooks.define(...args);
      },

      /**
       * @param {...Parameters<typeof context.hooks.execute>} args HookBus.execute parameters
       * @returns HookBus.execute return value
       */
      execute: <K extends keyof Hooks>(...args: Parameters<typeof context.hooks.execute<K>>) => {
        this.assertSealed("hook.execute");

        return context.hooks.execute(...args);
      },
    };

    // Events
    this.#emitter = emitter;
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
    const result = this.#lifecycle.seal();

    // Notify kernel events
    if (result.success && this.#emitter?.kernelSealed) {
      this.#emitter.kernelSealed();
    }

    return result;
  }

  /**
   * Start the kernel
   *
   * @returns Result of the lifecycle start operation
   */
  start() {
    const result = this.#lifecycle.start();

    // Notify kernel events
    if (result.success && this.#emitter?.kernelStarted) {
      this.#emitter.kernelStarted();
    }

    return result;
  }

  /**
   * Stop the kernel
   *
   * @returns Result of the lifecycle stop operation
   */
  stop() {
    const result = this.#lifecycle.stop();

    // Notify kernel events
    if (result.success && this.#emitter?.kernelStopped) {
      this.#emitter.kernelStopped();
    }

    return result;
  }

  /**
   * Assert that the kernel is not sealed
   *
   * @param action Action name
   * @throws {InvalidLifecycleStateError} If the kernel is sealed
   */
  private assertNotSealed(action: string): void {
    if (this.#lifecycle.is("sealed")) {
      throw new InvalidLifecycleStateError({
        action,
        state: this.#lifecycle.state,
      });
    }
  }

  /**
   * Assert that the kernel is sealed
   *
   * @param action Action name
   * @throws {InvalidLifecycleStateError} If the kernel is not sealed
   */
  private assertSealed(action: string): void {
    if (!this.#lifecycle.is("sealed")) {
      throw new InvalidLifecycleStateError({
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
