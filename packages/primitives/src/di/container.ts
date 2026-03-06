import type { DiContainer, PropertyKey } from "./types.js";

import { DiContainerError } from "./error.js";

/**
 * Dependency Injection Container.
 *
 * @typeParam Services - Record of service identifiers and their corresponding types.
 *
 * @remarks
 * Lifecycle controls and disposal are demanded to the services themselves.
 * The container only manages instantiation and caching.
 *
 * @example
 * ```ts
 * const container = new DefaultDiContainer<{
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
export class DefaultDiContainer<
  Services extends Record<PropertyKey, unknown> = {},
> implements DiContainer<Services> {
  /** Factories map */
  #factories = new Map<keyof Services, () => Services[keyof Services]>();

  /** Instances map */
  #instances = new Map<keyof Services, Services[keyof Services]>();

  /**
   * @inheritdoc
   */
  define<K extends keyof Services>(key: K, factory: () => Services[K]): void {
    if (this.#factories.has(key)) {
      throw new DiContainerError("already_registered", {
        service: key as PropertyKey,
      });
    }

    this.#factories.set(key, factory);
  }

  /**
   * @inheritdoc
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
      throw new DiContainerError("not_registered", {
        service: key as PropertyKey,
      });
    }

    // Create a new instance
    const instance = factory();

    // Cache the instance for future use
    this.#instances.set(key, instance);

    return instance as Services[K];
  }

  /**
   * @inheritdoc
   */
  clear(): void {
    this.#instances.clear();
  }
}
