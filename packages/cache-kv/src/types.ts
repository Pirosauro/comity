/**
 * Represents a namespace for key-value caching.
 */
export interface KvNamespace {
  /** Retrieves a value by its key. */
  get(key: string): Promise<string | null>;

  /** Stores a value with an optional expiration time. */
  put(
    key: string,
    value: string,
    options?: {
      /** Time-to-live in seconds */
      expirationTtl?: number;
    }
  ): Promise<void>;

  /** Deletes a value by its key. */
  delete(key: string): Promise<void>;
}
