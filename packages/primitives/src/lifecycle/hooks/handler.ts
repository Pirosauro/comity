/**
 * Hook handler function
 *
 * @typeParam T - The type of value being handled
 *
 * @param value Current value
 * @param initial Initial value
 *
 * @returns New value or a promise resolving to the new value
 *
 * @remarks
 * A hook handler is a function that processes a value, potentially
 * transforming it and returning a new value. It can be synchronous or
 * return a promise for asynchronous processing.
 */
export type HookHandler<T> = (value: T, initial: Readonly<T>) => T | Promise<T>;
