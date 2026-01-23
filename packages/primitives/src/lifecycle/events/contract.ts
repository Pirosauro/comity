import type { EventHandler } from "./handler.js";

/**
 * Event Bus Contract
 *
 * @typeParam Events - Record of event names to payload types
 *
 * @remarks
 * This interface defines the contract for an Event Bus, which allows subscribing
 * to events and emitting events with associated payloads.
 */
export interface EventBusContract<Events extends Record<string, unknown>> {
  /**
   * Subscribe to an event with a handler
   *
   * @param event Event name
   * @param handler Event handler function
   *
   * @typeParam K - Key of the event in the Events record
   */
  subscribe<K extends keyof Events>(
    event: K,
    handler: EventHandler<Events[K]>,
  ): void;

  /**
   * Emit an event with a payload
   *
   * @param event Event name
   * @param payload Event payload
   *
   * @typeParam K - Key of the event in the Events record
   */
  emit<K extends keyof Events>(event: K, payload: Events[K]): Promise<void>;
}
