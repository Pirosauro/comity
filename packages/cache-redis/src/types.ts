/**
 * Interface representing a Redis client with basic operations for caching.
 */
export interface RedisClient {
  /**
   * Retrieves a value from Redis by its key.
   *
   * @param key - The key to retrieve the value for.
   *
   * @returns A promise that resolves to the value associated with the key, or null if the key does not exist.
   */
  get(key: string): Promise<string | null>;

  /**
   * Sets a value in Redis with the specified key and optional arguments.
   *
   * @param key - The key to set the value for.
   * @param value - The value to set.
   * @param args - Optional additional arguments for the Redis SET command (e.g., expiration).
   *
   * @returns A promise that resolves when the operation is complete.
   */
  set(key: string, value: string, ...args: unknown[]): Promise<unknown>;

  /**
   * Deletes a value from Redis by its key.
   *
   * @param key - The key to delete.
   *
   * @returns A promise that resolves when the operation is complete.
   */
  del(key: string): Promise<unknown>;
}
