import type { HookHandler } from "./contract.js";

/**
 * Hook Bus Like interface.
 *
 * @typeParam T - Hook map where keys are hook names and values are the context types
 *                that flow through the hook pipeline
 */
export interface HookBusLike<T extends Record<string, unknown> = {}> {
  /**
   * Register a hook handler.
   *
   * @param name - The hook name to register for
   * @param handler - Function that processes the hook context
   */
  define<K extends keyof T>(name: K, handler: HookHandler<T[K]>): void;

  /**
   * Execute a hook chain.
   *
   * @param name - The hook name to execute
   * @param initial - The initial context to pass through the hook chain
   *
   * @returns A promise resolving to the final context after all handlers
   */
  execute<K extends keyof T>(name: K, initial: T[K]): Promise<T[K]>;
}
