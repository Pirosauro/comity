import type { EventHandler, HookHandler } from "@comity/primitives/lifecycle";
import type { KernelLifecycleObserver } from "./observers/lifecycle.js";
import type { KernelLifecycleState } from "./observers/types.js";
import type {
    KernelContext,
    KernelEventBus,
    KernelHookBus,
    KernelServiceResolver,
} from "./types.js";

import { toSafePayload } from "@comity/primitives/errors";
import { isSuccess } from "@comity/primitives/result";
import { KernelError } from "./errors/kernel.js";
import { Lifecycle } from "./internal/lifecycle.js";

/**
 * Kernel class.
 */
export class Kernel<
  Services extends Record<keyof Services, unknown> = {},
  Events extends Record<keyof Events, unknown> = {},
  Hooks extends Record<keyof Hooks, unknown> = {},
> {
  /** Service container */
  #services: KernelServiceResolver<Services>;

  /** Event bus */
  #events: KernelEventBus<Events>;

  /** Hook bus */
  #hooks: KernelHookBus<Hooks>;

  /** Lifecycle manager */
  #lifecycle = new Lifecycle();

  /** Kernel lifecycle events */
  #emitter: KernelLifecycleObserver | undefined;

  /**
   * @param context - Kernel context
   * @param emitter - Kernel lifecycle events emitter
   */
  constructor(context: KernelContext<Services, Events, Hooks>, emitter?: KernelLifecycleObserver) {
    // Services
    this.#services = {
      /**
       * @param name - Service name
       * @param factory - Service factory
       *
       * @returns void
       */
      define: <K extends keyof Services>(name: K, factory: () => Services[K]) => {
        this.#assertLifecycle(() => this.#lifecycle.canDefineServices(), "service.define");

        return context.services.define(name, factory);
      },

      /**
       * @param name - Service name
       *
       * @returns The resolved service instance
       */
      resolve: <K extends keyof Services>(name: K) => {
        this.#assertLifecycle(() => this.#lifecycle.canResolveServices(), "service.resolve");

        return context.services.resolve(name) as Services[K];
      },

      /**
       * @returns void
       */
      clear: () => {
        this.#assertLifecycle(() => this.#lifecycle.canDefineServices(), "service.clear");

        return context.services.clear();
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
        this.#assertLifecycle(() => this.#lifecycle.canDefineServices(), "event.subscribe");

        return context.events.subscribe(...args);
      },

      /**
       * @param event - Event name
       * @param handler - Event handler
       *
       * @returns void
       */
      unsubscribe: <K extends keyof Events>(event: K, handler: EventHandler<Events[K]>) => {
        this.#assertLifecycle(() => this.#lifecycle.canDefineServices(), "event.unsubscribe");

        return context.events.unsubscribe(event, handler);
      },

      /**
       * @param event - Event name
       * @param payload - Event payload
       *
       * @returns void
       */
      emit: <K extends keyof Events>(event: K, payload: Events[K]) => {
        this.#assertLifecycle(() => this.#lifecycle.canEmitEvents(), "event.emit");

        return context.events.emit(event, payload);
      },
    };

    // Hooks
    this.#hooks = {
      /**
       * @param name - Hook name
       * @param handler - Hook handler
       *
       * @returns void
       */
      define: <K extends keyof Hooks>(name: K, handler: HookHandler<Hooks[K]>) => {
        this.#assertLifecycle(() => this.#lifecycle.canDefineServices(), "hook.define");

        return context.hooks.define(name, handler);
      },

      /**
       * @param name - Hook name
       * @param initial - Initial hook payload
       *
       * @returns The final hook payload after execution
       */
      execute: <K extends keyof Hooks>(name: K, initial: Hooks[K]) => {
        this.#assertLifecycle(() => this.#lifecycle.canExecuteHooks(), "hook.execute");

        return context.hooks.execute(name, initial);
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
   */
  seal(): ReturnType<Lifecycle["seal"]> {
    const from = this.#lifecycle.state;
    const result = this.#lifecycle.seal();
    const to = this.#lifecycle.state;

    // Notify kernel events
    this.#handleLifecycleResult(from, to, result, this.#emitter?.onKernelSealed);

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
    this.#handleLifecycleResult(from, to, result, this.#emitter?.onKernelStarted);

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
    this.#handleLifecycleResult(from, to, result, this.#emitter?.onKernelStopped);

    return result;
  }

  /**
   * Assert a lifecycle condition
   *
   * @param predicate - Function that returns a boolean indicating if the condition is met
   * @param action - Action name for error reporting
   *
   * @throws {KernelError} If the lifecycle condition is not met
   */
  #assertLifecycle(predicate: () => boolean, action: string): void {
    if (!predicate()) {
      throw new KernelError("invalid_lifecycle_state", {
        details: {
          action,
          state: this.#lifecycle.state,
        },
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
  #handleLifecycleResult(
    from: KernelLifecycleState,
    to: KernelLifecycleState,
    result: ReturnType<Lifecycle["seal"] | Lifecycle["start"] | Lifecycle["stop"]>,
    onSuccess?: () => void
  ) {
    if (from !== to) {
      this.#emitter?.onStateTransition?.({ from, to });
    }

    if (isSuccess(result)) {
      onSuccess?.();
    } else {
      this.#emitter?.onError?.(toSafePayload(result.error));
    }
  }
}
