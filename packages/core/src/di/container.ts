import type { DiContainerContract } from "./contract.js";

import { ConflictError } from "../errors/conflict.js";
import { NotFoundError } from "../errors/not-found.js";

/**
 * Dependency Injection Container
 *
 * @typeParam Services - Record of service identifiers and their corresponding types
 *
 * @example
 * ```ts
 * const container = new DiContainer<{
 *   logger: LoggerService;
 *   userService: UserService;
 * }>();
 *
 * container.define("logger", () => new LoggerService());
 * container.define("userService", () => new UserService(container.resolve("logger")));
 *
 * const userService = container.resolve("userService");
 * ```
 */
export class DiContainer<
  Services extends { [K in keyof Services]: unknown },
> implements DiContainerContract<Services> {
  /** Factories map */
  #factories = new Map<keyof Services, () => Services[keyof Services]>();

  /** Instances map */
  #instances = new Map<keyof Services, Services[keyof Services]>();

  /**
   * Define a service factory
   *
   * @param key - Service identifier
   * @param factory - Factory function to create the service instance
   * @throws {ConflictError} If the service is already registered
   *
   * @typeParam K - Key of the service in the Services record
   */
  define<K extends keyof Services>(key: K, factory: () => Services[K]): void {
    if (this.#factories.has(key)) {
      throw new ConflictError("Service already registered", {
        service: key,
      });
    }

    this.#factories.set(key, factory);
  }

  /**
   * Resolve a service by its identifier
   *
   * @param key - Service identifier
   * @returns The service instance
   *
   * @throws {NotFoundError} If the service is not registered
   *
   * @typeParam K - Key of the service in the Services record
   */
  resolve<K extends keyof Services>(key: K): Services[K] {
    // Return existing instance if available
    if (this.#instances.has(key)) {
      return this.#instances.get(key) as Services[K];
    }

    // Get the factory for the service
    const factory = this.#factories.get(key);

    // Service not registered
    if (!factory) {
      throw new NotFoundError("Service not registered", {
        service: key,
      });
    }

    // Create a new instance
    const instance = factory();

    // Cache the instance for future use
    this.#instances.set(key, instance);

    return instance as Services[K];
  }
}
