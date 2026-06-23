/**
 * @param value - The value to normalize to a float.
 *
 * @returns The normalized float value, or 0 if the input cannot be converted to a float.
 */
export function normalizeToFloat(value: unknown): number {
  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string") {
    const parsed = parseFloat(value);

    if (!isNaN(parsed)) {
      return parsed;
    }
  }

  return 0; // Default fallback value
}

/**
 * @param value - The value to normalize to an integer.
 *
 * @returns The normalized integer value, or 0 if the input cannot be converted to an integer.
 */
export function normalizeToInt(value: unknown): number {
  if (typeof value === "number") {
    return Math.floor(value);
  }

  if (typeof value === "string") {
    const parsed = parseInt(value, 10);

    if (!isNaN(parsed)) {
      return parsed;
    }
  }

  return 0; // Default fallback value
}

/**
 * @param value - The value to normalize to a string.
 *
 * @returns The normalized string value, or an empty string if the input cannot be converted to a string.
 */
export function normalizeToString(value: unknown): string {
  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  return ""; // Default fallback value
}

/**
 * @param value - The value to normalize to a boolean.
 *
 * @returns The normalized boolean value, or false if the input cannot be converted to a boolean.
 */
export function normalizeToBoolean(value: unknown): boolean {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    const lower = value.toLowerCase();

    if (lower === "true") {
      return true;
    } else if (lower === "false") {
      return false;
    }
  }

  if (typeof value === "number") {
    return value !== 0;
  }

  return false; // Default fallback value
}
