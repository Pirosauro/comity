import type { Token } from "./types.js";

/**
 * Create a new token
 *
 * @param description Token description
 * @returns New token
 *
 * @typeParam T - Token type string
 *
 * @example
 * ```typescript
 * const MyServiceToken = createToken<"MyService">("MyService");
 * ```
 */
export function createToken<T extends string>(description: string): Token<T> {
  return Symbol(description) as Token<T>;
}
