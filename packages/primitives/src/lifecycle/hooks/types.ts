import type { ReadonlyDeep } from "../../types.js";

/**
 * Hook Bus Contract
 *
 * @typeParam Hooks - Record of hook names and their corresponding value types
 *
 * @remarks
 * This interface defines the contract for a Hook Bus, which allows defining
 * and executing hooks identified by names. Each hook can have multiple handlers
 * that process a value of a specific type.
 */
export interface HookBus<Hooks extends Record<string, unknown>> {
  /**
   * Define a hook with a handler
   *
   * @typeParam K - Key of the hook in the Hooks record
   *
   * @param name Hook name
   * @param handler Hook handler function
   */
  define<K extends keyof Hooks>(name: K, handler: HookHandler<Hooks[K]>): void;

  /**
   * Execute a hook by name with an initial value
   *
   * @typeParam K - Key of the hook in the Hooks record
   *
   * @param name Hook name
   * @param initial Initial value
   *
   * @returns Final value after all handlers have been executed
   *
   * @remarks
   * This method executes all handlers associated with the specified hook name,
   * passing the initial value through each handler in sequence. The final value
   * is returned after all handlers have been executed.
   */
  execute<K extends keyof Hooks>(name: K, initial: Hooks[K]): Promise<Hooks[K]>;
}

/**
 * Hook handler function
 *
 * @typeParam T - The type of value being handled
 *
 * @param value - Current value
 * @param initial - Initial value as reference
 *
 * @returns New value or a promise resolving to the new value
 *
 * @remarks
 * A hook handler is a function that processes a value, potentially
 * transforming it and returning a new value. It can be synchronous or
 * return a promise for asynchronous processing.
 */
export type HookHandler<T> = (
  value: ReadonlyDeep<T>,
  initial: ReadonlyDeep<T>
) => T | ReadonlyDeep<T> | Promise<T> | Promise<ReadonlyDeep<T>>;
