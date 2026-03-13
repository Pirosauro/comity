/**
 * Defines the interface for a cache store, which provides methods for getting, setting, deleting, and optionally clearing cache entries.
 */
export interface CacheStore {
  /** Retrieves a value from the cache by its key. */
  get(key: string): Promise<string | undefined>;

  /** Stores a value in the cache with an optional time-to-live (TTL) in seconds. */
  set(
    key: string,
    value: string,
    options?: {
      /** Time-to-live in seconds. */
      ttl?: number;
    }
  ): Promise<void>;

  /** Deletes a value from the cache by its key. */
  delete(key: string): Promise<void>;

  /** Clears all entries from the cache. */
  clear?(): Promise<void>;
}
