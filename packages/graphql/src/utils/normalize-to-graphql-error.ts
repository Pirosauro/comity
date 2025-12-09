import { GraphQLError } from "graphql";

export function normalizeToGraphQLError(
  error: unknown,
  code: string = "INTERNAL_SERVER_ERROR",
  extensions: Record<string, any> = {}
): GraphQLError {
  // Already a GraphQLError
  if (error instanceof GraphQLError) {
    return error;
  }

  // Standard Error
  if (error instanceof Error) {
    return new GraphQLError(error.message, {
      extensions: {
        ...extensions,
        code,
        cause: {
          name: error.name,
          stack: error.stack,
          // SyntaxError
          ...(error.name === "SyntaxError" && {
            location: (error as any).location,
          }),
        },
      },
    });
  }

  // String
  if (typeof error === "string") {
    return new GraphQLError(error, {
      extensions: { ...extensions, code },
    });
  }

  // Object with message
  if (error && typeof error === "object" && "message" in error) {
    return new GraphQLError(String((error as any).message), {
      extensions: {
        ...extensions,
        code,
        cause: error,
      },
    });
  }

  // Default
  return new GraphQLError("Unknown error occurred", {
    extensions: { ...extensions, code },
  });
}
