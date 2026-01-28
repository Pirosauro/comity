import type { Token } from "./types.js";

/**
 * Create a new token
 *
 * @typeParam T - Token type string
 *
 * @param description Token description
 *
 * @returns New token
 *
 * @example
 * ```typescript
 * const MyServiceToken = createToken<"MyService">("MyService");
 * ```
 */
export function createToken<T extends string>(description: string): Token<T> {
  return Symbol(description) as Token<T>;
}
