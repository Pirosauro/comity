/**
 * Lazy contract
 *
 * @typeParam T - The type of the lazy value
 *
 * @remarks
 * This interface defines the contract for a lazy value, which is
 * instantiated on first access. The value can be either a direct
 * value or a promise resolving to the value.
 *
 * **Use Cases:**
 * - Expensive object creation (e.g., database connections, API clients)
 * - Conditional initialization (only if/when needed)
 * - Memoization of pure computations
 */
export interface LazyContract<T> {
  /** The lazy value, which may be a direct value or a promise */
  readonly value: T | Promise<T>;
}
