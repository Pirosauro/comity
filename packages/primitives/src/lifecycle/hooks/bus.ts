import type { HookBusContract, HookHandler } from "./contract.js";

/**
 * Hook bus implementation
 *
 * @typeParam Hooks - Record of hook names and their corresponding value types
 *
 * @example
 * ```ts
 * interface MyHooks {
 *   beforeSave: string;
 *   afterSave: number;
 * }
 *
 * const hookBus = new HookBus<MyHooks>();
 *
 * // Define a hook
 * hookBus.define("beforeSave", (value, initial) => {
 *   console.log("Before save:", value);
 *   return value.toUpperCase();
 * });
 *
 * // Execute a hook
 * const result = await hookBus.execute("beforeSave", "myData");
 * console.log(result); // Outputs: "MYDATA"
 * ```
 */
export class HookBus<
  Hooks extends { [K in keyof Hooks]: unknown },
> implements HookBusContract<Hooks> {
  /** Hook handlers mapped by hook name */
  #handlers: {
    [K in keyof Hooks]?: Set<HookHandler<Hooks[K]>>;
  } = {};

  /** @inheritdoc */
  define<K extends keyof Hooks>(name: K, handler: HookHandler<Hooks[K]>): void {
    const list = this.#handlers[name] ?? new Set();

    list.add(handler);
    this.#handlers[name] = list;
  }

  /** @inheritdoc */
  async execute<K extends keyof Hooks>(name: K, initial: Hooks[K]): Promise<Hooks[K]> {
    const handlers = this.#handlers[name];

    // No handlers, return initial value
    if (!handlers) return initial;

    let value = initial;

    // Execute all handlers in sequence
    for (const handler of handlers) {
      value = (await handler(value, initial)) as Hooks[K];
    }

    return value;
  }
}
