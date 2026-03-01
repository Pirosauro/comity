import type { BaseError } from "../../error/base.js";

/**
 * Event Bus Error Handler
 *
 * @param error Error instance
 *
 * @remarks
 * A function that handles errors occurring in event handlers.
 */
export type EventBusErrorHandler = (error: BaseError) => void;

/**
 * Event Bus Options
 */
export type EventBusOptions = {
  /** Error handler for event handler failures */
  errorHandler?: EventBusErrorHandler;
};
