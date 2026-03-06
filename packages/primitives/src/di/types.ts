/**
 * Dependency Injection (DI) Container Property Types.
 */
export type PropertyKey = string | symbol;

/**
 * Dependency Injection Container Contract.
 *
 * @typeParam Services - Record mapping service identifiers to their types.
 *
 * @remarks
 * This interface defines the contract for a Dependency Injection (DI) Container,
 * which allows registering and resolving services by their identifiers.
 */
export interface DiContainer<Services extends Record<PropertyKey, unknown>> {
  /**
   * Register a service with a factory function.
   *
   * @typeParam K - Key of the service in the Services record.
   *
   * @param name - Service identifier.
   * @param factory - Factory function to create the service instance.
   *
   * @throws {ContainerError} - If the service is already registered.
   */
  define<K extends keyof Services>(name: K, factory: () => Services[K]): void;

  /**
   * Resolve a service by its name.
   *
   * @typeParam K - Key of the service in the Services record.
   *
   * @param name - Service identifier.
   *
   * @returns - The service instance.
   *
   * @throws {ContainerError} - If the service is not registered.
   */
  resolve<K extends keyof Services>(name: K): Services[K];

  /**
   * Clear cached instances.
   */
  clear(): void;
}
