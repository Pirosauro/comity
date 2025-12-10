/**
 * Lazily instantiates and caches a value using a factory function.
 *
 * @remarks
 * The `Lazy` class provides a simple way to defer expensive computations or object creation
 * until the value is actually needed. The factory function is only called once, on first access.
 * Subsequent accesses return the cached value.
 *
 * **Use Cases:**
 * - Expensive object creation (e.g., database connections, API clients)
 * - Conditional initialization (only if/when needed)
 * - Memoization of pure computations
 *
 * @typeParam T - The type of value produced by the factory
 *
 * @example
 * Lazy database connection
 * ```typescript
 * const db = new Lazy(() => createDatabaseConnection());
 *
 * // ...
 * if (shouldQuery) {
 *   const conn = db.value; // Connection is created here, if not already
 *   // Use conn...
 * }
 * ```
 */
export class Lazy<T> {
  #value?: T;
  #factory: () => T;

  /**
   * Creates a new Lazy instance with the given factory function.
   *
   * @param factory - Function that produces the value when needed
   */
  constructor(factory: () => T) {
    this.#factory = factory;
  }

  /**
   * Returns the lazily-created value, instantiating it on first access.
   *
   * @returns The value produced by the factory function
   */
  get value(): T {
    if (this.#value === undefined) {
      this.#value = this.#factory();
    }
    return this.#value;
  }
}
