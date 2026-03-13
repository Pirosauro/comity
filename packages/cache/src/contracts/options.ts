/**
 * Cache module contracts.
 */
export interface CacheKeyOptions {
  /** Optional namespace for the cache key */
  namespace?: string;
}

/**
 * Options for cache get operations.
 */
export interface CacheGetOptions extends CacheKeyOptions {}

/**
 * Options for cache delete operations.
 */
export interface CacheDeleteOptions extends CacheKeyOptions {}

/**
 * Options for cache set operations.
 */
export interface CacheSetOptions extends CacheKeyOptions {
  /** Time-to-live for the cache entry in seconds. */
  ttl?: number;
}
