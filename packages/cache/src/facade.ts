import type { Cache } from "./contracts/cache.js";
import type { CacheDeleteOptions, CacheGetOptions, CacheSetOptions } from "./contracts/options.js";
import type { CacheStore } from "./contracts/store.js";

/**
 * DefaultCache is the default implementation of the Cache interface.
 */
export class DefaultCache implements Cache {
  /**  */
  #store: CacheStore;

  /**
   * @param store - The cache store to use.
   */
  constructor(store: CacheStore) {
    this.#store = store;
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
  }

  /**
   * @inheritdoc
   */
  async delete(key: string, options?: CacheDeleteOptions): Promise<void> {
    const k = this.#key(key, options?.namespace);

    await this.#store.delete(k);
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
