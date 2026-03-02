import type { BaseError } from "../../error/base.js";
import type { EventHandler } from "./contract.js";

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

/**
 * Event Bus Like interface.
 *
 * @typeParam Events - Record of event names to payload types.
 */
export interface EventBusLike<Events extends Record<string, unknown> = {}> {
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
