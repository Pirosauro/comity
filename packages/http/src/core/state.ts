/**
 * Pipeline state container.
 *
 * Provides namespaced storage.
 */
export interface HttpState {
  /**
   * Retrieves a value from the shared pipeline state.
   * @param key The namespaced key.
   * @returns The stored value or undefined.
   * @example
   * state.get<string>("userId");
   */
  get<T = unknown>(key: string): T | undefined;
  /**
   * Stores a value into the shared pipeline state.
   * @param key The namespaced key.
   * @param value The value to persist.
   * @example
   * state.set("traceId", "abc123");
   */
  set<T = unknown>(key: string, value: T): void;
  /**
   * Checks if a key exists in the shared pipeline state.
   * @param key The namespaced key.
   * @returns True when the key is present.
   * @example
   * state.has("user");
   */
  has(key: string): boolean;
}

/**
 * Creates a default in-memory HttpState implementation.
 * @returns A mutable HttpState instance.
 * @example
 * const state = createHttpState();
 */
export function createHttpState(): HttpState {
  const store = new Map<string, unknown>();

  return {
    get<T = unknown>(key: string): T | undefined {
      return store.get(key) as T | undefined;
    },
    set<T = unknown>(key: string, value: T): void {
      store.set(key, value);
    },
    has(key: string): boolean {
      return store.has(key);
    },
  };
}