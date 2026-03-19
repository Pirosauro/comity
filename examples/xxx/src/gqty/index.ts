/**
 * GQty: You can safely modify this file based on your needs.
 */

import { createReactClient } from "@gqty/react";
import {
  Cache,
  createClient,
  defaultResponseHandler,
  type QueryFetcher,
} from "gqty";
import {
  generatedSchema,
  scalarsEnumsHash,
  type GeneratedSchema,
} from "./schema.generated";

const queryFetcher: QueryFetcher = async function (
  { query, variables, operationName },
  fetchOptions
) {
  // Modify "https://1aba42f5.ho.net.co/graphql" if needed
  const response = await fetch("https://1aba42f5.ho.net.co/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables,
      operationName,
    }),
    mode: "cors",
    ...fetchOptions,
  });

  return await defaultResponseHandler(response);
};

const cache = new Cache(
  undefined,
  /**
   * Cache is valid for 30 minutes, but starts revalidating after 5 seconds,
   * allowing soft refetches in background.
   */
  {
    maxAge: 5000,
    staleWhileRevalidate: 30 * 60 * 1000,
    normalization: true,
  }
);

export const client = createClient<GeneratedSchema>({
  schema: generatedSchema,
  scalars: scalarsEnumsHash,
  cache,
  fetchOptions: {
    fetcher: queryFetcher,
  },
});

// Core functions
export const { resolve, subscribe, schema } = client;

// Legacy functions
export const {
  query,
  mutation,
  mutate,
  subscription,
  resolved,
  refetch,
  track,
} = client;

export const {
  graphql,
  useQuery,
  usePaginatedQuery,
  useTransactionQuery,
  useLazyQuery,
  useRefetch,
  useMutation,
  useMetaState,
  prepareReactRender,
  useHydrateCache,
  prepareQuery,
} = createReactClient<GeneratedSchema>(client, {
  defaults: {
    // Enable Suspense, you can override this option for each hook.
    suspense: true,
  },
});

export * from "./schema.generated";
