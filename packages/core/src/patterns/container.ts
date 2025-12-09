import { NotFoundError } from "../errors/not-found.js";

export enum ServiceFlags {
  /** No special configuration */
  NONE = 0,
  /** Service is a singleton (cached after first creation) */
  SINGLETON = 1 << 0, // 1 (binary: 0001)
}

/**
 * Generic dependency injection container with lazy instantiation.
 *
 * @remarks
 * This container provides a centralized way to manage service dependencies with lazy instantiation.
 * Services are created only when first requested, improving startup performance and memory usage.
 *
 * **Supported Service Lifecycles:**
 * - **Singleton**: Created once and cached for subsequent requests
 * - **Transient**: New instance created on every access
 *
 * The container follows the factory pattern internally, storing factory functions rather than
 * instances, allowing for flexible service creation strategies.
 *
 * @example
 * Basic container usage
 * ```typescript
 * const container = new Container();
 *
 * // Register singleton services (default)
 * container.register('logger', () => new Logger({ level: 'info' }));
 * container.register('cache', () => new CacheService(), ServiceFlags.SINGLETON);
 *
 * // Register transient services
 * container.register('requestId', () => crypto.randomUUID(), ServiceFlags.NONE);
 *
 * // Use services
 * const logger = container.get<Logger>('logger');
 * const cache = container.get<CacheService>('cache');
 * ```
 *
 * @example
 * Middleware-scoped container usage
 * ```typescript
 * app.use(async (c, next) => {
 *   const db = c.get("db");
 *   const container = new Container();
 *
 *   // Register services with closures over middleware context
 *   container.register('userRepo', () => new UserRepository(db.primary, db.replica));
 *   container.register('logger', () => new Logger({
 *     requestId: c.get('requestId'),
 *     level: 'info'
 *   }));
 *
 *   c.set('container', container);
 *   await next();
 * });
 * ```
 *
 * @example
 * Service lifecycle behavior
 * ```typescript
 * const container = new Container();
 *
 * // Singleton services (cached after first creation)
 * container.register('logger', () => new Logger(), ServiceFlags.SINGLETON);
 * const logger1 = container.get<Logger>('logger');
 * const logger2 = container.get<Logger>('logger');
 * console.log(logger1 === logger2); // true - same instance
 *
 * // Transient services (new instance each time)
 * container.register('requestId', () => crypto.randomUUID(), ServiceFlags.NONE);
 * const id1 = container.get<string>('requestId');
 * const id2 = container.get<string>('requestId');
 * console.log(id1 === id2); // false - different instances
 * ```
 */
export class Container {
  #factories = new Map<string, () => any>();
  #instances = new Map<string, any>();
  #flags = new Map<string, ServiceFlags>();

  /**
   * Registers a factory function for service creation.
   *
   * @param key - Unique identifier for the service
   * @param factory - Function that creates the service instance
   * @param flags - Service configuration flags using bitwise operations
   *
   * @remarks
   * The factory function is called lazily when the service is first requested.
   * Factory functions should be pure and not depend on external state that might change.
   *
   * **Service Lifecycles:**
   * - `ServiceFlags.SINGLETON`: Created once, cached, same instance returned for all subsequent calls
   * - `ServiceFlags.NONE` (transient): New instance created on every access, no caching
   *
   * **Factory Function Guidelines:**
   * - Should be side-effect free during registration
   * - Can capture variables from the registration scope (closures)
   * - Will be called on the first access for singletons, every access for transients
   *
   * @defaultValue `flags` defaults to `ServiceFlags.SINGLETON`
   *
   * @throws {@link Error}
   * Thrown when attempting to register a service with an existing key
   *
   * @example
   * Register different service types
   * ```typescript
   * // Singleton service (default behavior)
   * container.register('logger', () => new Logger({
   *   level: process.env.LOG_LEVEL || 'info'
   * }));
   *
   * // Explicit singleton registration
   * container.register('cache', () => new CacheService(), ServiceFlags.SINGLETON);
   *
   * // Transient service (new instance each time)
   * container.register('requestId', () => crypto.randomUUID(), ServiceFlags.NONE);
   *
   * // Service with captured dependencies
   * const dbConnection = await createDbConnection();
   * container.register('userRepo', () => new UserRepository(dbConnection));
   * ```
   *
   * @example
   * Using closures for dependency injection
   * ```typescript
   * // In middleware where dependencies are available
   * app.use(async (c, next) => {
   *   const db = c.get("db");
   *   const user = c.get("user");
   *   const container = new Container();
   *
   *   // Factory captures middleware context
   *   container.register('userRepo', () => new UserRepository(db.primary, db.replica));
   *   container.register('ability', () => createAbility(user.permissions));
   *
   *   c.set('container', container);
   *   await next();
   * });
   * ```
   */
  public register<T>(
    key: string,
    factory: () => T,
    flags: ServiceFlags = ServiceFlags.SINGLETON
  ): void {
    if (this.#factories.has(key)) {
      throw new Error(`Service "${key}" is already registered`);
    }

    this.#factories.set(key, factory);
    this.#flags.set(key, flags);
  }

  /**
   * Retrieves a service instance, creating it lazily if needed.
   *
   * @param key - The service identifier used during registration
   * @returns The service instance
   *
   * @remarks
   * **Resolution Behavior:**
   * - **Singleton services**: First call creates and caches the instance, subsequent calls return the cached instance
   * - **Transient services**: New instance created on every call, no caching
   *
   * **Performance Considerations:**
   * - Singleton caching improves performance for expensive-to-create services
   * - Transient services have no memory overhead but have recreation cost on each access
   * - Factory functions are only called when needed (lazy evaluation)
   *
   * **Type Safety:**
   * - Use generic type parameter for compile-time type checking
   * - Runtime type checking is not performed
   *
   * @throws {@link NotFoundError}
   * Thrown when requesting a service that hasn't been registered
   *
   * @example
   * Service retrieval and type safety
   * ```typescript
   * // Type-safe service retrieval
   * const userRepo = container.get<UserRepository>('userRepo');
   * const logger = container.get<Logger>('logger');
   * const cache = container.get<CacheService>('cache');
   *
   * // Use the services
   * const users = await userRepo.list();
   * logger.info('Retrieved users', { count: users.length });
   * cache.set('user-count', users.length);
   * ```
   *
   * @example
   * Understanding service lifecycle behavior
   * ```typescript
   * // Singleton behavior - same instance returned
   * const repo1 = container.get<UserRepository>('userRepo');
   * const repo2 = container.get<UserRepository>('userRepo');
   * console.log(repo1 === repo2); // true for singletons
   *
   * // Transient behavior - different instances
   * const id1 = container.get<string>('requestId');
   * const id2 = container.get<string>('requestId');
   * console.log(id1 === id2); // false for transient services
   * ```
   *
   * @example
   * Error handling for missing services
   * ```typescript
   * try {
   *   const service = container.get<SomeService>('nonexistent');
   * } catch (error) {
   *   console.error('Service not found:', error.message);
   * }
   * ```
   */
  public get<T>(key: string): T {
    const flags = this.#flags.get(key) ?? ServiceFlags.NONE;

    // Return cached instance for singletons
    if ((flags & ServiceFlags.SINGLETON) !== 0 && this.#instances.has(key)) {
      return this.#instances.get(key) as T;
    }

    const factory = this.#factories.get(key);

    if (!factory) {
      throw new NotFoundError(`Service "${key}" is not registered`);
    }

    const instance = factory();

    // Cache singleton instances
    if ((flags & ServiceFlags.SINGLETON) !== 0) {
      this.#instances.set(key, instance);
    }

    return instance as T;
  }

  /**
   * Checks if a service is registered with the container.
   *
   * @param key - The service identifier to check
   * @returns `true` if the service is registered, `false` otherwise
   *
   * @remarks
   * This method only checks registration status, not instantiation status.
   * A service can be registered but not yet instantiated if it's a singleton
   * that hasn't been accessed yet.
   *
   * **Use Cases:**
   * - Conditional service usage
   * - Feature detection
   * - Validation during application startup
   * - Debugging and introspection
   *
   * @example
   * Conditional service usage and feature detection
   * ```typescript
   * // Check if optional services are available
   * if (container.has('analytics')) {
   *   const analytics = container.get<AnalyticsService>('analytics');
   *   analytics.track('user.login', { userId: user.id });
   * }
   *
   * // Graceful degradation for optional features
   * const logger = container.has('logger')
   *   ? container.get<Logger>('logger')
   *   : console; // Fallback to console
   * ```
   *
   * @example
   * Startup validation
   * ```typescript
   * // Validate required services during application startup
   * const requiredServices = ['logger', 'database', 'userRepo'];
   * const missing = requiredServices.filter(service => !container.has(service));
   *
   * if (missing.length > 0) {
   *   throw new Error(`Missing required services: ${missing.join(', ')}`);
   * }
   *
   * console.log('All required services are registered');
   * ```
   */
  public has(key: string): boolean {
    return this.#factories.has(key);
  }

  /**
   * Clears all singleton instances, forcing re-instantiation on next access.
   *
   * @remarks
   * This method only clears cached singleton instances, not the service registrations.
   * Services will be re-instantiated when next accessed via {@link get}.
   * Transient services are unaffected as they don't maintain cached instances.
   *
   * **Side Effects:**
   * - All cached singleton instances are destroyed and become eligible for garbage collection
   * - Next access to singleton services will trigger factory functions again
   * - May cause performance impact if expensive services need re-creation
   * - Useful for testing scenarios where fresh instances are needed
   *
   * **When to Use:**
   * - Testing scenarios requiring clean state between tests
   * - Memory cleanup in long-running applications
   * - Forcing re-initialization with updated configuration
   * - Development hot-reloading scenarios
   *
   * **Performance Impact:**
   * - Expensive singleton services will need to be recreated
   * - May cause temporary memory spikes during recreation
   * - Consider selective clearing for better performance
   *
   * @example
   * Testing with fresh instances
   * ```typescript
   * describe('UserService', () => {
   *   beforeEach(() => {
   *     // Clear cached instances for clean test state
   *     container.clear();
   *   });
   *
   *   test('should create user', async () => {
   *     const userRepo = container.get<UserRepository>('userRepo');
   *     // Test with fresh repository instance
   *   });
   * });
   * ```
   *
   * @example
   * Memory management in long-running processes
   * ```typescript
   * // Periodic cleanup in background services
   * setInterval(() => {
   *   const beforeCount = container.getRegisteredKeys()
   *     .filter(key => container.isInstantiated(key)).length;
   *
   *   container.clear();
   *
   *   console.log(`Cleared ${beforeCount} cached service instances`);
   * }, 3600000); // Every hour
   * ```
   */
  public clear(): void {
    this.#instances.clear();
  }
}
