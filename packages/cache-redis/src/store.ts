import type { CacheStore } from "@comity/cache";
import type { RedisClient } from "./types.js";

/**
 * RedisCacheStore is an implementation of the CacheStore interface that uses Redis as the underlying storage mechanism.
 */
export class RedisCacheStore implements CacheStore {
  /** The Redis client used for caching operations. */
  #client: RedisClient;

  /**
   * @param client - The Redis client to use for caching operations.
   */
  constructor(client: RedisClient) {
    this.#client = client;
  }

  /**
   * @inheritdoc
   */
  async get(key: string): Promise<string | undefined> {
    const v = await this.#client.get(key);

    if (v == null) return undefined;

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
    const ttl = options?.ttl;

    if (ttl) {
      await this.#client.set(key, value, "EX", ttl);
    } else {
      await this.#client.set(key, value);
    }
  }

  /**
   * @inheritdoc
   */
  async delete(key: string): Promise<void> {
    await this.#client.del(key);
  }
}
