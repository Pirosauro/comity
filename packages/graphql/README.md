# @comity/graphql

The `@comity/graphql` package provides GraphQL integration for Comity-based projects: modular schema building, Hono-based GraphQL server, Envelop plugin support, and type-safe GraphQL module definitions.

This package is intended to be consumed by applications that need to build GraphQL APIs with plugin architecture, modular schemas, and extensible functionality.

## Features

- Modular GraphQL schema building with type-safe module definitions
- Hono-based GraphQL server with automatic middleware integration
- Envelop plugin ecosystem support for advanced GraphQL features
- Automatic schema generation from registered query/mutation/subscription modules
- Built-in error handling and normalization
- Support for GraphQL subscriptions
- Type-safe field definitions with resolvers and arguments
- Configurable GraphQL endpoint path and options

## Quickstart

Install the monorepo (pnpm workspace):

```bash
pnpm install
```

Create a GraphQL API with Comity modules:

```ts
import { setup } from "@comity/graphql/setup";
import { createApplication } from "@comity/application";

const app = await createApplication(
  [
    // GraphQL setup module
    setup({
      path: "/graphql", // Optional, defaults to "/graphql"
      plugins: [], // Envelop plugins
      enableInternalTracing: false,
    }),
  ],
  {} // module options
);

// The GraphQL endpoint is now available at /graphql
export default app;
```

Define GraphQL modules:

```ts
import type { GraphQLModule } from "@comity/graphql";

export const userModule: GraphQLModule = {
  queries: {
    user: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: async (_, { id }) => {
        return { id, name: "User " + id, email: "user@example.com" };
      },
    },
    users: {
      type: new GraphQLList(UserType),
      resolve: async () => {
        return [
          { id: "1", name: "Alice", email: "alice@example.com" },
          { id: "2", name: "Bob", email: "bob@example.com" },
        ];
      },
    },
  },
  mutations: {
    createUser: {
      type: UserType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (_, { name, email }) => {
        // Create user logic
        return { id: "3", name, email };
      },
    },
  },
};
```

## API

- `setup(options?)`

  - Returns an ApplicationModuleMeta that sets up GraphQL integration
  - Creates a Hono router mounted at the specified path
  - Integrates with Comity's application context and logging

- `GraphQLContainer`

  - Manages GraphQL schema modules (queries, mutations, subscriptions)
  - Provides methods to register modules and build schemas
  - Used internally by the setup module

- `createGraphQLMiddleware(options, context)`

  - Creates Hono middleware for GraphQL request handling
  - Handles GET/POST requests, parameter parsing, and execution
  - Returns GraphQL responses with proper error formatting

- `graphqlHandler(options)`

  - Simplified GraphQL handler factory (primarily for testing)
  - Creates middleware without requiring full application context

## Module authoring

Define GraphQL modules using the `GraphQLModule` interface:

```ts
import type { GraphQLModule } from "@comity/graphql";
import { GraphQLObjectType, GraphQLString, GraphQLID } from "graphql";

const UserType = new GraphQLObjectType({
  name: "User",
  fields: {
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
  },
});

export const userModule: GraphQLModule = {
  queries: {
    user: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: async (_, { id }, context) => {
        // Resolver logic here
        return await getUserById(id);
      },
    },
  },
  mutations: {
    createUser: {
      type: UserType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (_, { name, email }) => {
        return await createUser({ name, email });
      },
    },
  },
  subscriptions: {
    userCreated: {
      type: UserType,
      subscribe: async function* () {
        // Subscription logic
        for await (const user of userCreatedStream()) {
          yield user;
        }
      },
    },
  },
};
```

### Field Configuration

Each field supports:

- `type`: GraphQL output type
- `args`: Optional argument definitions
- `resolve`: Resolver function (queries/mutations)
- `subscribe`: Subscription function (subscriptions only)
- `description`: Optional field description
- `deprecationReason`: Optional deprecation notice

### Envelop Plugins

Extend GraphQL functionality with Envelop plugins:

```ts
import { useApolloTracing } from "@envelop/apollo-tracing";
import { useValidationCache } from "@envelop/validation-cache";

const graphqlSetup = setup({
  plugins: [useApolloTracing(), useValidationCache()],
  enableInternalTracing: true,
});
```

## Configuration

The GraphQL module accepts these configuration options:

```ts
interface GraphQLModuleOptions {
  path?: string; // GraphQL endpoint path (default: "/graphql")
  plugins?: Plugin[]; // Envelop plugins
  enableInternalTracing?: boolean; // Enable internal tracing
  // ... Hono options (cors, etc.)
}
```

### Request Handling

The GraphQL endpoint supports:

- **GET requests**: Query parameters `query`, `variables`, `operationName`
- **POST requests**:
  - `application/json`: Standard GraphQL HTTP request
  - `application/graphql`: Raw query string
  - `application/x-www-form-urlencoded`: Form-encoded parameters

### Error Handling

Errors are automatically normalized to GraphQL format with appropriate HTTP status codes:

- Validation errors: 200 (included in response)
- Syntax errors: 400
- Authentication errors: 401/403
- System errors: 500

## Schema Building

The GraphQL schema is built dynamically from registered modules:

```ts
// Root Query type includes all registered queries
type Query {
  user(id: ID!): User
  users: [User!]!
  // ... other queries
}

// Root Mutation type includes all registered mutations
type Mutation {
  createUser(name: String!, email: String!): User!
  // ... other mutations
}

// Root Subscription type includes all registered subscriptions
type Subscription {
  userCreated: User!
  // ... other subscriptions
}
```

## Development & Tests

Run the package tests (from repository root):

```bash
pnpm -w -F @comity/graphql test
```

Run the full monorepo test suite:

```bash
pnpm -w test
```

Linting and type checks are provided at the workspace level; run your usual tooling as needed.

## License

See the package `LICENSE` in the repository root.
