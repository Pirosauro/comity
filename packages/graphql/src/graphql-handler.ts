/**
 * Creates a GraphQL handler middleware with the given options.
 * This is a simplified interface that doesn't require the full application context.
 */
export const graphqlHandler = (
  options: GraphQLModuleOptions
): HonoMiddlewareHandler => {
  // Create a mock context for the middleware
  const mockContext = {
    logger: {
      child: () => ({
        error: () => {},
        info: () => {},
        debug: () => {},
        warn: () => {},
      }),
      error: () => {},
      info: () => {},
      debug: () => {},
      warn: () => {},
    },
    emit: () => {},
    trigger: () => Promise.resolve(),
    onHook: () => {},
    onEvent: () => {},
  };

  return createGraphQLMiddleware(options, mockContext as any);
};
