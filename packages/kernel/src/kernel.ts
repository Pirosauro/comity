import type { DiContainer } from "@comity/primitives/di";
import type { EventBus, HookBus } from "@comity/primitives/lifecycle";
import type { KernelLifecycleEvents } from "./lifecycle/events.js";
import type { KernelLifecycleState } from "./lifecycle/types.js";

import { isSuccess } from "@comity/primitives/result";
import { KernelError } from "./error/kernel.js";
import { Lifecycle } from "./internal/lifecycle.js";

/**
 * Kernel context.
 */
export type KernelContext<
  Services extends { [K in keyof Services]: unknown },
  Events extends { [K in keyof Events]: unknown },
  Hooks extends { [K in keyof Hooks]: unknown },
> = {
  /** Service container */
  services: DiContainer<Services>;

  /** Event bus */
  events: EventBus<Events>;

  /** Hook bus */
  hooks: HookBus<Hooks>;
};

/**
 * Kernel class.
 */
export class Kernel<
  Services extends { [K in keyof Services]: unknown },
  Events extends { [K in keyof Events]: unknown },
  Hooks extends { [K in keyof Hooks]: unknown },
> {
  /** Service container */
  #services: {
    /** Define a service */
    define: DiContainer<Services>["define"];

    /** Resolve a service */
    resolve: DiContainer<Services>["resolve"];

    /** Clear cached instances */
    clear: DiContainer<Services>["clear"];
  };

  /** Event bus */
  #events: {
    /** Subscribe to an event */
    subscribe: EventBus<Events>["subscribe"];

    /** Unsubscribe from an event */
    unsubscribe: EventBus<Events>["unsubscribe"];

    /** Emit an event */
    emit: EventBus<Events>["emit"];
  };

  /** Hook bus */
  #hooks: {
    /** Define a hook */
    define: HookBus<Hooks>["define"];

    /** Execute a hook */
    execute: HookBus<Hooks>["execute"];
  };

  /** Lifecycle manager */
  #lifecycle = new Lifecycle();

  /** Kernel lifecycle events */
  #emitter: KernelLifecycleEvents | undefined;

  /**
   * @param context Kernel context
   * @param emitter Kernel lifecycle events emitter
   */
  constructor(context: KernelContext<Services, Events, Hooks>, emitter?: KernelLifecycleEvents) {
    // Services
    this.#services = {
      /**
       * @param {...Parameters<typeof context.services.define>} args DiContainer.define parameters
       *
       * @returns DiContainer.define return value
       */
      define: <K extends keyof Services>(
        ...args: Parameters<typeof context.services.define<K>>
      ) => {
        this.assertLifecycle(() => this.#lifecycle.canDefineServices(), "service.define");

        return context.services.define(...args);
      },

      /**
       * @param {...Parameters<typeof context.services.resolve>} args DiContainer.resolve parameters
       *
       * @returns DiContainer.resolve return value
       */
      resolve: <K extends keyof Services>(
        ...args: Parameters<typeof context.services.resolve<K>>
      ) => {
        this.assertLifecycle(() => this.#lifecycle.canResolveServices(), "service.resolve");

        return context.services.resolve(...args);
      },

      /**
       * @param {...Parameters<typeof context.services.clear>} args DiContainer.clear parameters
       *
       * @returns DiContainer.clear return value
       */
      clear: (...args: Parameters<typeof context.services.clear>) => {
        this.assertLifecycle(() => this.#lifecycle.canDefineServices(), "service.clear");

        return context.services.clear(...args);
      },
    };

    // Events
    this.#events = {
      /**
       * @param {...Parameters<typeof context.events.subscribe>} args EventBus.subscribe parameters
       *
       * @returns EventBus.subscribe return value
       */
      subscribe: <K extends keyof Events>(
        ...args: Parameters<typeof context.events.subscribe<K>>
      ) => {
        this.assertLifecycle(() => this.#lifecycle.canDefineServices(), "event.subscribe");

        return context.events.subscribe(...args);
      },

      /**
       * @param {...Parameters<typeof context.events.unsubscribe>} args EventBus.unsubscribe parameters
       *
       * @returns EventBus.unsubscribe return value
       */
      unsubscribe: <K extends keyof Events>(
        ...args: Parameters<typeof context.events.unsubscribe<K>>
      ) => {
        this.assertLifecycle(() => this.#lifecycle.canDefineServices(), "event.unsubscribe");

        return context.events.unsubscribe(...args);
      },

      /**
       * @param {...Parameters<typeof context.events.emit>} args EventBus.emit parameters
       *
       * @returns EventBus.emit return value
       */
      emit: <K extends keyof Events>(...args: Parameters<typeof context.events.emit<K>>) => {
        this.assertLifecycle(() => this.#lifecycle.canEmitEvents(), "event.emit");

        return context.events.emit(...args);
      },
    };

    // Hooks
    this.#hooks = {
      /**
       * @param {...Parameters<typeof context.hooks.define>} args HookBus.define parameters
       *
       * @returns HookBus.define return value
       */
      define: <K extends keyof Hooks>(...args: Parameters<typeof context.hooks.define<K>>) => {
        this.assertLifecycle(() => this.#lifecycle.canDefineServices(), "hook.define");

        return context.hooks.define(...args);
      },

      /**
       * @param {...Parameters<typeof context.hooks.execute>} args HookBus.execute parameters
       *
       * @returns HookBus.execute return value
       */
      execute: <K extends keyof Hooks>(...args: Parameters<typeof context.hooks.execute<K>>) => {
        this.assertLifecycle(() => this.#lifecycle.canExecuteHooks(), "hook.execute");

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
   * @returns Result of the lifecycle seal operation
   *
   * @remarks
   * Sealing the kernel transitions it to a state where services can be resolved,
   * events can be emitted, and hooks can be executed. After sealing, no further
   * modifications to services, events, or hooks are allowed.
   *
   */
  seal(): ReturnType<Lifecycle["seal"]> {
    const from = this.#lifecycle.state;
    const result = this.#lifecycle.seal();
    const to = this.#lifecycle.state;

    // Notify kernel events
    this.handleLifecycleResult(from, to, result, this.#emitter?.onKernelSealed);

    return result;
  }

  /**
   * Start the kernel
   *
   * @returns Result of the lifecycle start operation
   */
  start() {
    const from = this.#lifecycle.state;
    const result = this.#lifecycle.start();
    const to = this.#lifecycle.state;

    // Notify kernel events
    this.handleLifecycleResult(from, to, result, this.#emitter?.onKernelStarted);

    return result;
  }

  /**
   * Stop the kernel
   *
   * @returns Result of the lifecycle stop operation
   */
  stop() {
    const from = this.#lifecycle.state;
    const result = this.#lifecycle.stop();
    const to = this.#lifecycle.state;

    // Notify kernel events
    this.handleLifecycleResult(from, to, result, this.#emitter?.onKernelStopped);

    return result;
  }

  /**
   * Assert a lifecycle condition
   *
   * @param predicate - Function that returns a boolean indicating if the condition is met
   * @param action - Action name for error reporting
   *
   * @throws {CoreError} If the lifecycle condition is not met
   */
  private assertLifecycle(predicate: () => boolean, action: string): void {
    if (!predicate()) {
      throw new KernelError("invalid_lifecycle_state", {
        action,
        state: this.#lifecycle.state,
      });
    }
  }

  /**
   * Handle lifecycle operation result and emit corresponding events.
   *
   * @param from - Previous lifecycle state
   * @param to - Current lifecycle state
   * @param result - Result of a lifecycle operation (seal, start, stop)
   * @param onSuccess - Optional callback to execute on successful lifecycle transition
   */
  private handleLifecycleResult(
    from: KernelLifecycleState,
    to: KernelLifecycleState,
    result: ReturnType<Lifecycle["seal"] | Lifecycle["start"] | Lifecycle["stop"]>,
    onSuccess?: () => void
  ) {
    if (isSuccess(result)) {
      if (from !== to) {
        this.#emitter?.onStateTransition?.(from, to);
      }

      onSuccess?.();
    } else {
      this.#emitter?.onError?.(result.error);
    }
  }
}
