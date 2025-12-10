import { GraphQLError } from "graphql";

export function normalizeToGraphQLError(
  error: unknown,
  code: string = "INTERNAL_SERVER_ERROR",
  extensions: Record<string, any> = {}
): GraphQLError {
  // Already a GraphQLError - preserve existing extensions but add our code if not present
  if (error instanceof GraphQLError) {
    const existingExtensions = error.extensions || {};
    return new GraphQLError(error.message, {
      nodes: error.nodes,
      source: error.source,
      positions: error.positions,
      path: error.path,
      originalError: error.originalError,
      extensions: {
        ...existingExtensions,
        ...extensions,
        code: existingExtensions.code || code,
      },
    });
  }

  // Standard Error with enhanced context
  if (error instanceof Error) {
    const extensionsWithContext = {
      ...extensions,
      code,
      timestamp: new Date().toISOString(),
      cause: {
        name: error.name,
        message: error.message,
        stack: error.stack,
        // Include additional error properties if they exist
        ...((error as any).code && { originalCode: (error as any).code }),
        ...((error as any).errno && { errno: (error as any).errno }),
        // SyntaxError specific properties
        ...(error.name === "SyntaxError" && {
          location: (error as any).location,
        }),
        // ValidationError specific properties
        ...(error.name === "ValidationError" && {
          details: (error as any).details,
        }),
      },
    };

    return new GraphQLError(error.message, {
      extensions: extensionsWithContext,
    });
  }

  // String error
  if (typeof error === "string") {
    return new GraphQLError(error, {
      extensions: {
        ...extensions,
        code,
        timestamp: new Date().toISOString(),
      },
    });
  }

  // Object with message property
  if (error && typeof error === "object" && "message" in error) {
    const errorObj = error as any;
    return new GraphQLError(String(errorObj.message), {
      extensions: {
        ...extensions,
        code,
        timestamp: new Date().toISOString(),
        cause: {
          ...errorObj,
          // Remove sensitive information
          password: undefined,
          token: undefined,
          secret: undefined,
        },
      },
    });
  }

  // Handle specific error types
  if (error && typeof error === "object") {
    const errorObj = error as any;

    // Network errors
    if (errorObj.code === "ECONNREFUSED" || errorObj.code === "ENOTFOUND") {
      return new GraphQLError("Service temporarily unavailable", {
        extensions: {
          ...extensions,
          code: "NETWORK_ERROR",
          timestamp: new Date().toISOString(),
          cause: {
            code: errorObj.code,
            message: errorObj.message,
          },
        },
      });
    }

    // Timeout errors
    if (errorObj.code === "ETIMEDOUT" || errorObj.name === "TimeoutError") {
      return new GraphQLError("Request timeout", {
        extensions: {
          ...extensions,
          code: "TIMEOUT_ERROR",
          timestamp: new Date().toISOString(),
          cause: {
            code: errorObj.code,
            message: errorObj.message,
          },
        },
      });
    }
  }

  // Default unknown error with enhanced context
  return new GraphQLError("An unexpected error occurred", {
    extensions: {
      ...extensions,
      code,
      timestamp: new Date().toISOString(),
      cause: error,
    },
  });
}
