import type { Result } from "../core/types.js";
import type { AuthCredential } from "./credential.js";
import type { AuthContext } from "./context.js";

/**
 * AuthContextResolver Port
 *
 * Defines the capability to resolve authentication credentials into authenticated contexts.
 *
 * Invariants:
 * - resolve() returns a Result type (no exceptions for domain errors)
 * - Success contains a valid AuthContext with session
 * - Failure reason is a non-empty string
 * - now parameter is seconds since epoch
 *
 * Misuse Prevention:
 * - Always check result.ok before accessing value
 * - Do not modify the returned AuthContext (treat as immutable)
 * - Handle both success and failure cases
 */
export interface AuthContextResolver<
  I extends Record<string, unknown> = {},
  S extends Record<string, unknown> = {},
  R extends string = string
> {
  resolve(
    credential: AuthCredential,
    now: number
  ): Promise<Result<AuthContext<S, I>, R>>;
}
