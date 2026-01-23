/**
 * Dependency Injection Container Contract
 *
 * @typeParam Services - Record mapping service identifiers to their types
 *
 * @remarks
 * This interface defines the contract for a Dependency Injection (DI) Container,
 * which allows registering and resolving services by their identifiers.
 */
export interface DiContainerContract<
  Services extends Record<string | symbol, unknown>,
> {
  /**
   * Register a service with a factory function
   *
   * @param name Service identifier
   * @param factory Factory function to create the service instance
   *
   * @typeParam K - Key of the service in the Services record
   */
  define<K extends keyof Services>(name: K, factory: () => Services[K]): void;

  /**
   * Resolve a service by its name
   *
   * @param name Service identifier
   * @returns The service instance
   *
   * @typeParam K - Key of the service in the Services record
   */
  resolve<K extends keyof Services>(name: K): Services[K];
}
