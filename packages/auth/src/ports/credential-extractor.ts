import type { AuthCredential } from "./credential.js";

/**
 * AuthCredentialExtractor Port
 *
 * Defines the capability to extract authentication credentials from a context (e.g., HTTP request).
 *
 * Invariants:
 * - extract() returns either a valid AuthCredential or null
 * - Options parameter is optional and immutable
 * - Implementation must handle malformed input gracefully
 *
 * Misuse Prevention:
 * - Do not assume extract() always returns a credential (check for null)
 * - Validate credential.kind and credential.value before use
 * - Implementations should not throw exceptions for invalid input
 */
export interface AuthCredentialExtractor<
  R, // Context (eg. Request-like type)
  O extends Record<string, unknown> = {}
> {
  extract(context: R, options?: O): AuthCredential | null;
}
