import type { BaseError } from "./base.js";
import type { SafeErrorLike } from "./types.js";

/**
 * Sanitizes the meta object to include only transport-safe fields.
 *
 * @param input - The input meta object to sanitize
 *
 * @returns A sanitized meta object containing only string, number, boolean, or null values.
 */
function sanitizeMeta(input: unknown): Record<string, string | number | boolean | null> {
  if (!input || typeof input !== "object") return {};

  const out: Record<string, string | number | boolean | null> = {};

  for (const [key, value] of Object.entries(input)) {
    if (
      value === null ||
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "boolean"
    ) {
      out[key] = value;
    }
  }

  return out;
}

/**
 * Extracts a transport-safe error payload from a BaseError instance.
 *
 * @param error - The error to convert
 *
 * @returns A SafeErrorLike containing only transport-safe fields
 *
 * @remarks
 * - Removes stack trace
 * - Removes cause
 * - Preserves stable machine-readable fields
 */
export function toSafePayload(error: BaseError): SafeErrorLike {
  const { httpStatus, timestamp, ...meta } = sanitizeMeta(error.meta);

  return {
    code: error.code,
    message: error.message,
    ...(typeof httpStatus === "number" && { httpStatus }),
    timestamp: typeof timestamp === "string" ? timestamp : new Date().toISOString(),
    meta,
  };
}
