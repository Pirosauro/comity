import type { GraphqlVar } from "./contracts/graphql.js";

/**
 * Creates a GraphQL variable reference for use in query construction.
 *
 * @param name - The name of the variable to reference.
 *
 * @returns A GraphqlVar object representing the variable reference, which can be used in GraphQL query construction.
 */
export function graphqlVar(name: string): GraphqlVar {
  return { __var: name };
}
