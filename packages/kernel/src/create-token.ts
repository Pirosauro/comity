import type { Token } from "./types.js";

/**
 * Create a new token
 *
 * @typeParam T - Token type string
 * @typeParam R - Token return type
 *
 * @param description Token description
 *
 * @returns New token
 *
 * @example
 * ```typescript
 * const MyServiceToken = createToken<"MyService", MyService>("MyService");
 * ```
 */
export function createToken<T extends string, R = unknown>(description: string): Token<T, R> {
  return Symbol(description) as Token<T, R>;
}
