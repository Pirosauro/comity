import type { Cache } from "./contracts/cache.js";
import type { CacheDeleteOptions, CacheGetOptions, CacheSetOptions } from "./contracts/options.js";
import type { CacheStore } from "./contracts/store.js";
import type { CacheObserver } from "./hooks/cache.js";

/**
 * DefaultCache is the default implementation of the Cache interface.
 */
export class DefaultCache implements Cache {
  /**  */
  #store: CacheStore;

  /**  */
  #observer: CacheObserver | undefined;

  /**
   * @param store - The cache store to use.
   * @param observer - Optional cache observer to emit events to.
   */
  constructor(store: CacheStore, observer?: CacheObserver) {
    this.#store = store;
    this.#observer = observer;
  }

  /**
   * Generates a cache key with an optional namespace.
   *
   * @param key - The key to use.
   * @param ns - Optional namespace to prefix the key with.
   *
   * @returns The generated cache key.
   */
  #key(key: string, ns?: string): string {
    return ns ? `${ns}:${key}` : key;
  }

  /**
   * @inheritdoc
   */
  async get(key: string, options?: CacheGetOptions): Promise<string | undefined> {
    const k = this.#key(key, options?.namespace);

    const value = await this.#store.get(k);

    if (value === undefined) {
      this.#observer?.onCacheMiss({
        key,
        ...(options?.namespace !== undefined ? { namespace: options.namespace } : {}),
      });
    } else {
      this.#observer?.onCacheHit({
        key,
        ...(options?.namespace !== undefined ? { namespace: options.namespace } : {}),
      });
    }

    return value;
  }

  /**
   * @inheritdoc
   */
  async set(key: string, value: string, options?: CacheSetOptions): Promise<void> {
    const k = this.#key(key, options?.namespace);

    await this.#store.set(k, value, {
      ...(options?.ttl !== undefined ? { ttl: options.ttl } : {}),
    });

    this.#observer?.onCacheSet({
      key,
      ...(options?.namespace !== undefined ? { namespace: options.namespace } : {}),
    });
  }

  /**
   * @inheritdoc
   */
  async delete(key: string, options?: CacheDeleteOptions): Promise<void> {
    const k = this.#key(key, options?.namespace);

    await this.#store.delete(k);

    this.#observer?.onCacheDelete({
      key,
      ...(options?.namespace !== undefined ? { namespace: options.namespace } : {}),
    });
  }

  /**
   * @inheritdoc
   */
  async getOrSet(
    key: string,
    loader: () => Promise<string>,
    options?: CacheSetOptions
  ): Promise<string> {
    const v = await this.get(key, options);

    if (v !== undefined) {
      return v;
    }

    const value = await loader();

    await this.set(key, value, options);

    return value;
  }
}
