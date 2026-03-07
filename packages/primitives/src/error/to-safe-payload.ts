import type { JsonValue, SafeErrorPayload } from "./types.js";

import { BaseError } from "./base.js";

/**
 * Sanitizes the meta object to include only transport-safe fields.
 *
 * @param input - The input meta object to sanitize
 *
 * @returns A sanitized meta object containing only string, number, boolean, or null values.
 */
function sanitizeMeta(input: unknown): Record<string, JsonValue> {
  if (!input || typeof input !== "object") return {};

  const out: Record<string, JsonValue> = {};

  for (const [key, value] of Object.entries(input)) {
    if (isJsonValue(value)) {
      out[key] = value;
    }
  }

  return out;
}

/**
 * Converts a BaseError instance into a SafeErrorPayload object suitable for transport.
 *
 * @param value - The value to check
 *
 * @returns true if the value is a JsonValue, false otherwise
 *
 * @remarks
 * This function checks if the provided value is a valid JsonValue, which includes:
 * - Primitive types (string, number, boolean, null)
 * - Arrays of JsonValues
 * - Objects with string keys and JsonValue values
 *
 * This is used to ensure that only transport-safe data is included in the error payload.
 *
 * @return true if the value is a JsonValue, false otherwise
 *
 */
function isJsonValue(value: unknown): value is JsonValue {
  if (
    value === null ||
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  )
    return true;

  if (Array.isArray(value)) {
    return value.every(isJsonValue);
  }

  if (typeof value === "object") {
    return Object.values(value).every(isJsonValue);
  }

  return false;
}

/**
 * Extracts a transport-safe error payload from a BaseError instance.
 *
 * @param error - The error to convert
 *
 * @returns A SafeErrorPayload containing only transport-safe fields
 *
 * @remarks
 * - Removes stack trace
 * - Removes cause
 * - Preserves stable machine-readable fields
 */
export function toSafePayload(error: unknown): SafeErrorPayload {
  if (!(error instanceof BaseError)) {
    const message = error instanceof Error ? error.message : String(error);

    return {
      code: "unknown",
      message: message || "An unknown error occurred",
      timestamp: new Date().toISOString(),
    };
  }

  const { httpStatus, reason, context, details } = error.meta;

  return {
    code: error.code,
    message: error.message,
    timestamp: new Date().toISOString(),
    ...(typeof httpStatus === "number" && { httpStatus }),
    ...(typeof reason === "string" && { reason }),
    ...(typeof details === "object" && { details: sanitizeMeta(details) }),
    ...(typeof context === "object" && { context: sanitizeMeta(context) }),
  };
}
