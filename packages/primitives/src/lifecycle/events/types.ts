import type { BaseError } from "../../error/base.js";

/**
 * Event Bus Contract.
 *
 * @typeParam Events - Record of event names to payload types.
 *
 * @remarks
 * This interface defines the contract for an Event Bus, which allows subscribing
 * to events and emitting events with associated payloads.
 */
export interface EventBus<Events extends Record<string, unknown>> {
  /**
   * Subscribe to an event with a handler.
   *
   * @typeParam K - Key of the event in the Events record.
   *
   * @param event - Event name
   * @param handler - Event handler function
   */
  subscribe<K extends keyof Events>(event: K, handler: EventHandler<Events[K]>): void;

  /**
   * Unsubscribe from an event.
   *
   * @typeParam K - Key of the event in the Events record.
   *
   * @param event - Event name
   * @param handler - The exact handler function that was previously registered
   */
  unsubscribe<K extends keyof Events>(event: K, handler: EventHandler<Events[K]>): void;

  /**
   * Emit an event with a payload.
   *
   * @typeParam K - Key of the event in the Events record.
   *
   * @param event - Event name
   * @param payload - Event payload
   */
  emit<K extends keyof Events>(event: K, payload: Events[K]): Promise<void>;
}

/**
 * Event handler function
 *
 * @typeParam T - Type of the event payload
 *
 * @remarks
 * An event handler is a function that processes an event payload. It can be
 * synchronous or return a promise for asynchronous processing.
 */
export type EventHandler<T> = (payload: Readonly<T>) => void | Promise<void>;

/**
 * Event Bus Error Handler.
 *
 * @param error - Error instance.
 *
 * @remarks
 * A function that handles errors occurring in event handlers.
 */
export type EventBusErrorHandler = (error: BaseError) => void;

/**
 * Event Bus Options.
 */
export type EventBusOptions = {
  /** Error handler for event handler failures */
  errorHandler?: EventBusErrorHandler;
};
