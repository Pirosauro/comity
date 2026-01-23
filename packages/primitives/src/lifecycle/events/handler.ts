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
