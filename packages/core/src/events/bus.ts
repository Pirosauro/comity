import type { EventBusContract } from "./contract.js";
import type { EventHandler } from "./handler.js";
import type { EventBusErrorHandler, EventBusOptions } from "./options.js";

import { InternalError } from "../errors/internal.js";

/**
 * Event Bus implementation
 *
 * @example
 * ```ts
 * interface MyEvents {
 *   userCreated: { id: string; name: string };
 *   userDeleted: { id: string };
 * }
 *
 * const bus = new EventBus<MyEvents>({
 *   errorHandler: (error) => {
 *     console.error("Event handler error:", error);
 *   },
 * });
 *
 * // Subscribe to an event
 * bus.subscribe("userCreated", async (payload) => {
 *   console.log("User created:", payload);
 * });
 *
 * // Emit an event
 * await bus.emit("userCreated", { id: "123", name: "Alice" });
 * ```
 */
export class EventBus<
  Events extends Record<string, unknown> = Record<string, unknown>,
> implements EventBusContract<Events> {
  /** Event handlers mapped by event name */
  #handlers = new Map<keyof Events, Set<EventHandler<Events[keyof Events]>>>();

  /** Optional error handler for event handler failures */
  #onError?: EventBusErrorHandler;

  /**
   * @param options Event bus options
   */
  constructor(private readonly options: EventBusOptions = {}) {
    if (options.errorHandler) {
      this.#onError = options.errorHandler;
    }
  }

  /**
   * Subcribe to an event
   *
   * @param event Event name
   * @param handler Event handler
   *
   * @typeParam K - Key of the event in the Events record
   */
  subscribe<K extends keyof Events>(
    event: K,
    handler: EventHandler<Events[K]>,
  ): void {
    const set = this.#handlers.get(event) ?? new Set();

    set.add(handler as EventHandler<unknown>);
    this.#handlers.set(event, set);
  }

  /**
   * Emit an event with a payload
   *
   * @param event Event name
   * @param payload Event payload
   *
   * @typeParam K - Key of the event in the Events record
   */
  async emit<K extends keyof Events>(
    event: K,
    payload: Events[K],
  ): Promise<void> {
    const handlers = this.#handlers.get(event);

    // No handlers, nothing to do
    if (!handlers) return;

    // Execute all handlers in parallel
    await Promise.all(
      [...handlers].map(async (h) => {
        try {
          await h(payload as Readonly<Events[K]>);
        } catch (cause) {
          this.#onError?.(
            new InternalError("Event handler failed", {
              event,
              cause,
            }),
          );
        }
      }),
    );
  }
}
