import type { HttpResponse } from "../contracts/response.js";

import { HTTP_INTENTS } from "../contracts/response.js";

/**
 * Checks if a value is an HttpResponse
 *
 * @param value Value to check
 * @returns True if the value is an HttpResponse, false otherwise
 *
 * @remarks
 * This function performs a runtime check to determine if the provided value
 * conforms to the HttpResponse type structure, which includes a 'intent' property
 * with one of the predefined string values.
 *
 * @example
 * ```typescript
 * const value: unknown = ...;
 * if (isHttpResponse(value)) {
 *   console.log("Value is an HttpResponse of intent:", value.intent);
 * } else {
 *   console.log("Value is not an HttpResponse");
 * }
 * ```
 */
export function isHttpResponse(value: unknown): value is HttpResponse {
  return (
    typeof value === "object" &&
    value !== null &&
    "intent" in value &&
    typeof (value as HttpResponse).intent === "string" &&
    HTTP_INTENTS.includes((value as HttpResponse).intent)
  );
}
