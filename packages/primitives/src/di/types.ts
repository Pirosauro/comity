/**
 * PropertyKey type representing valid keys for service identifiers in the DI container.
 */
export type PropertyKey = string | symbol;

/**
 * Dependency Injection Container Like interface.
 *
 * @typeParam Services - Record mapping service identifiers to their types.
 */
export interface DiContainerLike<Services extends Record<PropertyKey, unknown> = {}> {
  /**
   * Register a service with a factory function.
   *
   * @typeParam K - Key of the service in the Services record.
   *
   * @param name - Service identifier.
   * @param factory - Factory function to create the service instance.
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
   */
  resolve<K extends keyof Services>(name: K): Services[K];

  /**
   * Clear cached instances.
   */
  clear(): void;
}
