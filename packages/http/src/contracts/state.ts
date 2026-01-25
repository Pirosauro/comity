/**
 * Shared mutable state for the HTTP pipeline.
 *
 * @comity ai-jsdoc-skip
 */
export interface HttpState {
  /**
   * Retrieves a value from the shared pipeline state.
   *
   * @param key - Namespaced key.
   * @returns Stored value or undefined.
   */
  get<T = unknown>(key: string): T | undefined;

  /**
   * Stores a value into the shared pipeline state.
   *
   * @param key - Namespaced key.
   * @param value - Value to persist.
   */
  set<T = unknown>(key: string, value: T): void;

  /**
   * Checks if a key exists in the shared pipeline state.
   *
   * @param key - Namespaced key.
   * @returns True if key is present.
   */
  has(key: string): boolean;
}

/**
 * Creates a default in-memory HttpState implementation.
 *
 * @returns Mutable HttpState instance.
 *
 * @comity ai-jsdoc-skip
 */
export function createHttpState(): HttpState {
  const store = new Map<string, unknown>();

  return {
    /** @inheritdoc  */
    get<T = unknown>(key: string): T | undefined {
      return store.get(key) as T | undefined;
    },

    /** @inheritdoc  */
    set<T = unknown>(key: string, value: T): void {
      store.set(key, value);
    },

    /** @inheritdoc  */
    has(key: string): boolean {
      return store.has(key);
    },
  } as HttpState;
}
