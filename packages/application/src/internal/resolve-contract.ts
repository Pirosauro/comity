import type { ApplicationContract } from "../contracts/application.js";
import type { ApplicationResolver } from "../contracts/resolver.js";

/**
 * Resolves the given HTTP contract using the provided resolvers.
 *
 * @param contract - The HTTP contract to resolve.
 * @param resolvers - An array of application resolvers to apply to the contract.
 *
 * @returns A promise that resolves to the final HTTP contract after applying all resolvers.
 */
export async function resolveContract(
  contract: ApplicationContract,
  resolvers: ApplicationResolver[]
): Promise<ApplicationContract> {
  let current = contract;

  for (const resolver of resolvers) {
    const next = await resolver.resolve(current);

    if (next) {
      current = next;
    }
  }

  return current;
}
