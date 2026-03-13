import type { CacheDeleteOptions, CacheGetOptions, CacheSetOptions } from "./options.js";

/**
 * Cache interface defining the contract for cache operations.
 */
export interface Cache {
  /** Retrieves a value from the cache by its key. */
  get(key: string, options?: CacheGetOptions): Promise<string | undefined>;

  /** Stores a value in the cache with an optional time-to-live. */
  set(key: string, value: string, options?: CacheSetOptions): Promise<void>;

  /** Deletes a value from the cache by its key. */
  delete(key: string, options?: CacheDeleteOptions): Promise<void>;

  /** Retrieves a value from the cache or sets it if it doesn't exist. */
  getOrSet(key: string, loader: () => Promise<string>, options?: CacheSetOptions): Promise<string>;
}
