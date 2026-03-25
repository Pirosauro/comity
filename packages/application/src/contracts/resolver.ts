import type { ApplicationContract } from "./application.js";

/**
 *
 */
export interface ApplicationResolver {
  /**
   * Resolves the given HTTP contract and returns a new contract or null.
   *
   * @param contract - The HTTP contract to resolve.
   *
   * @returns A new HTTP contract or null if the contract cannot be resolved.
   */
  resolve(
    contract: ApplicationContract
  ): ApplicationContract | null | Promise<ApplicationContract | null>;
}
