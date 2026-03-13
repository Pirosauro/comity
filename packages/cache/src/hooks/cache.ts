/**
 * Cache observer payload.
 */
type CacheObserverPayload = {
  /** The key of the cache entry. */
  key: string;

  /** The namespace of the cache entry. */
  namespace?: string;
};

/**
 * Cache observer interface.
 */
export interface CacheObserver {
  /** Called when a cache entry is hit. */
  onCacheHit(payload: CacheObserverPayload): void;

  /** Called when a cache entry is missed. */
  onCacheMiss(payload: CacheObserverPayload): void;

  /** Called when a cache entry is set. */
  onCacheSet(payload: CacheObserverPayload): void;

  /** Called when a cache entry is deleted. */
  onCacheDelete(payload: CacheObserverPayload): void;

  /** Called when the cache is cleared. */
  onCacheClear(): void;
}
