import type { CacheStore } from "@comity/cache";
import type { KvNamespace } from "./types";

/**
 * A cache store implementation that uses a key-value namespace for storage.
 */
export class KvCacheStore implements CacheStore {
  /** The key-value namespace used for caching. */
  #ns: KvNamespace;

  /**
   * @param ns - The key-value namespace to use for caching.
   */
  constructor(ns: KvNamespace) {
    this.#ns = ns;
  }

  /**
   * @inheritdoc
   */
  async get(key: string): Promise<string | undefined> {
    const v = await this.#ns.get(key);

    if (v === null) return undefined;

    return v;
  }

  /**
   * @inheritdoc
   */
  async set(
    key: string,
    value: string,
    options?: {
      /** Time-to-live in seconds */
      ttl?: number;
    }
  ): Promise<void> {
    await this.#ns.put(key, value, {
      ...(options?.ttl ? { expirationTtl: options.ttl } : {}),
    });
  }

  /**
   * @inheritdoc
   */
  async delete(key: string): Promise<void> {
    await this.#ns.delete(key);
  }
}
