/**
 * Checks if a value is a non-null object (but not an array).
 *
 * @param value - The value to check.
 *
 * @returns True if the value is a non-null object, false otherwise.
 */
export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
