import type { GraphQLError } from "graphql";
import type { ContentfulStatusCode } from "hono/utils/http-status";

export function determineHttpStatus(
  errors: readonly GraphQLError[] | GraphQLError[]
): ContentfulStatusCode {
  if (!errors.length) return 200;

  // Look for the first error with a valid status code
  for (const error of errors) {
    const status = error.extensions?.status as ContentfulStatusCode | undefined;

    if (status && status >= 400) return status;
  }

  // Default to 200 OK for GraphQL responses with errors
  return 200;
}
