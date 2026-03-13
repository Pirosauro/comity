import type { CacheStore } from "../contracts/store.js";

/**
 * Internal type representing a cache entry, including the value and its optional expiration time.
 */
type Entry = {
  /** The value stored in the cache entry. */
  value: string;

  /** The expiration time of the cache entry, in milliseconds since the Unix epoch. */
  expires?: number;
};

/**
 * Memory-based implementation of the CacheStore interface.
 */
export class MemoryCacheStore implements CacheStore {
  #map = new Map<string, Entry>();

  /**
   * Retrieves a value from the cache by its key. If the entry has expired, it will be removed and undefined will be returned.
   *
   * @param key - The key of the cache entry to retrieve.
   *
   * @returns A promise that resolves to the value associated with the key, or undefined if the key does not exist or has expired.
   */
  async get(key: string): Promise<string | undefined> {
    const e = this.#map.get(key);

    // If the entry does not exist, return undefined
    if (!e) return undefined;

    // If the entry has an expiration time and it has expired, delete it and return undefined
    if (e.expires && e.expires < Date.now()) {
      this.#map.delete(key);

      return undefined;
    }

    return e.value;
  }

  /**
   * Stores a value in the cache with an optional time-to-live (TTL) in seconds.
   *
   * @param key - The key of the cache entry to store.
   * @param value - The value to store in the cache.
   * @param options - Optional settings for the cache entry.
   * @param options.ttl - Time-to-live in seconds for the cache entry.
   */
  async set(
    key: string,
    value: string,
    options?: {
      /** Time-to-live in seconds for the cache entry. */
      ttl?: number;
    }
  ): Promise<void> {
    const entry: Entry = {
      value,
      ...(options?.ttl ? { expires: Date.now() + options.ttl * 1000 } : {}),
    };

    this.#map.set(key, entry);
  }

  /**
   * Deletes a value from the cache by its key.
   *
   * @param key - The key of the cache entry to delete.
   */
  async delete(key: string): Promise<void> {
    this.#map.delete(key);
  }

  /**
   * Clears all entries from the cache.
   */
  async clear(): Promise<void> {
    this.#map.clear();
  }
}
