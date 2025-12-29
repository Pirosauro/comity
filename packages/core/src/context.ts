import { Container } from "./primitives/container.js";

/**
 * Type definition for lifecycle hook and event handler functions.
 *
 * @remarks
 * Lifecycle functions are used throughout the Comity framework to handle
 * application events and transformations during the bootstrap process and
 * runtime operations.
 *
 * **Function Signature:**
 * - Can be synchronous or asynchronous
 * - Receives a payload of generic type T
 * - May return void or undefined
 *
 * **Use Cases:**
 * - **Hooks**: Sequential processing where return values can transform the payload
 * - **Events**: Parallel notifications for logging, cleanup, or side effects
 *
 * @template T - The type of payload the function receives
 *
 * @example
 * Basic lifecycle function usage
 * ```typescript
 * const logHook: LifecycleHookFn<string> = async (message) => {
 *   console.log(`Hook received: ${message}`);
 * };
 *
 * const transformHook: LifecycleHookFn<object> = (data) => {
 *   return { ...data, timestamp: Date.now() };
 * };
 * ```
 */
export type LifecycleHookFn<T = any> = (
  payload: T
) => Promise<T | void> | T | void;

/**
 * CoreContext extends Container to provide DI, hooks, events, and context features for Comity modules.
 *
 * @remarks
 * Inherits all dependency injection features from {@link Container}.
 * Enables modules to interact with the Comity framework by:
 * - Registering and triggering lifecycle hooks (sequential, payload transformation)
 * - Registering and emitting events (parallel, notification)
 * - Structured logging (via Pino integration, if present)
 * - Dependency injection and service management
 *
 * You may dynamically assign custom properties to the context instance, but attempts to overwrite existing class properties or methods will throw an error. This is enabled by a Proxy returned from the constructor.
 *
 * @example
 * ```typescript
 * export const myModule = {
 *   setup: (options) => async (ctx: CoreContext) => {
 *     ctx.app.get('/health', (c) => c.text('OK'));
 *     ctx.api.get('/users', getUsersHandler);
 *     ctx.onHook('app:configure', configureApp);
 *     ctx.onEvent('user:created', sendWelcomeEmail);
 *     ctx.info('Module initialized', { module: 'my-module' });
 *     ctx.register('logger', () => new Logger());
 *     const logger = ctx.get<Logger>('logger');
 *   }
 * };
 * ```
 */
export class Context extends Container {
  #hooks: Record<string, LifecycleHookFn[]> = {};
  #events: Record<string, LifecycleHookFn[]> = {};

  /**
   * Registers a hook listener for a specific hook name.
   *
   * @param name - The hook name to listen for
   * @param fn - The function to execute when the hook is triggered
   *
   * @remarks
   * Hooks are executed sequentially and can transform the payload.
   * Each hook receives the result of the previous hook as input.
   */
  public onHook<T>(name: string, fn: LifecycleHookFn<T>): void {
    if (!this.#hooks[name]) this.#hooks[name] = [];

    this.#hooks[name].push(fn);
  }

  /**
   * Registers an event listener for a specific event name.
   *
   * @param name - The event name to listen for
   * @param fn - The function to execute when the event is emitted
   *
   * @remarks
   * Events are executed in parallel and are used for notifications.
   * Return values from event listeners are ignored.
   */
  public onEvent<T>(name: string, fn: LifecycleHookFn<T>): void {
    if (!this.#events[name]) this.#events[name] = [];

    this.#events[name].push(fn);
  }

  /**
   * Triggers all hook listeners for a given hook name with a payload.
   *
   * @param name - The hook name to trigger
   * @param payload - The data to pass to hook listeners
   * @returns Promise resolving to the final transformed payload
   *
   * @remarks
   * Hooks are executed sequentially, allowing each to transform the payload.
   * The final result after all transformations is returned.
   */
  public async trigger<T>(name: string, payload: T): Promise<T> {
    const fns = this.#hooks[name] || [];
    let current = payload;

    for (const fn of fns) {
      const result = await fn(current);

      if (result !== undefined) {
        current = result;
      }
    }

    return current;
  }

  /**
   * Emits an event to all listeners for a given event name.
   *
   * @param name - The event name to emit
   * @param payload - The data to pass to event listeners
   * @returns Promise that resolves when all listeners complete
   *
   * @remarks
   * Events are executed in parallel for better performance.
   * Return values from listeners are ignored.
   */
  public async emit<T>(name: string, payload?: T): Promise<void> {
    const fns = this.#events[name] || [];

    await Promise.all(fns.map((fn) => fn(payload)));
  }
}
