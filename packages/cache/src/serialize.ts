/**
 * Module for serializing cache keys in a deterministic way to ensure consistent cache hits.
 *
 * @param input - The input value to be normalized, which can be of any type including primitives, arrays, and objects.
 *
 * @returns A normalized version of the input value, where:
 */
function normalizeKey(input: unknown): unknown {
  if (input instanceof Date) {
    return input.toISOString();
  }

  if (Array.isArray(input)) {
    return input.map(normalizeKey);
  }

  if (input && typeof input === "object") {
    const obj: Record<string, unknown> = {};

    for (const k of Object.keys(input)) {
      const v = (input as Record<string, unknown>)[k];

      if (v !== undefined) {
        obj[k] = normalizeKey(v);
      }
    }

    return obj;
  }

  return input;
}

/**
 * Deterministic JSON stringifier that produces a stable string representation of an object.
 *
 * @param value - The value to stringify.
 *
 * @returns A stable string representation of the input value.
 */
function stableStringify(value: unknown): string {
  if (value === null || typeof value !== "object") {
    return JSON.stringify(value);
  }

  if (Array.isArray(value)) {
    return `[${value.map(stableStringify).join(",")}]`;
  }

  const obj = value as Record<string, unknown>;
  const keys = Object.keys(obj).sort();
  const entries = keys.map((k) => `${JSON.stringify(k)}:${stableStringify(obj[k])}`);

  return `{${entries.join(",")}}`;
}

/**
 * Hashes a string using the DJB2 algorithm.
 *
 * @param input - The string to hash.
 *
 * @returns A hashed string suitable for use as a cache key.
 */
function hash(input: string): string {
  let h = 5381;
  let i = input.length;

  while (i) {
    h = (h * 33) ^ input.charCodeAt(--i);
  }

  return (h >>> 0).toString(36);
}

/**
 * Type representing the structure of a cache key
 */
type CacheKey = Record<string, unknown>;

/**
 * Deterministic serializer for cache keys.
 *
 * @param key - The cache key to serialize, which can be any object containing primitive values, arrays, or nested objects.
 *
 * @returns A string that uniquely represents the input cache key, suitable for use as a cache key in caching systems.
 *
 * @remarks
 * - Stable (order-independent)
 * - Supports nested objects / arrays
 * - Avoids collisions
 */
export function serializeCacheKey(key: CacheKey): string {
  return hash(stableStringify(normalizeKey(key)));
}
