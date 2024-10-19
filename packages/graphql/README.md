# Comity Graphql Handler

A [Hono](https://hono.dev) middleware for handling GraphQL requests, integrated with [Envelop](https://the-guild.dev/graphql/envelop) for enhanced GraphQL server capabilities.

## Features

- **Performant**: Built on Hono, ensuring minimal overhead and high performance.
- **Pluggable**: Leverage Envelop plugins to enhance your GraphQL server with features like caching, tracing, and more.

## Installation

```bash
# with NPM
npm install @comity/graphql
# or with YARN
yarn add @comity/graphql
# or with PNPM
pnpm add @comity/graphql
```

## Usage

```ts
import { Hono, type Context } from "hono";
import { buildSchema } from "graphql";
import { graphqlHandler } from "@comity/graphql";
import { useLogger } from "@envelop/core";

const app = new Hono();
const schema = buildSchema(`
  type Query {
    hello: String
  }
`);

const rootResolver = (c: Context) => {
  return {
    hello: () => "Hello World!",
  };
};

app.use(
  "/graphql",
  graphqlHandler({
    schema,
    rootResolver,
    plugins: [useLogger()],
  })
);

app.fire();
```

## Credits

Based on the original work by [Minghe Huang](https://github.com/honojs/middleware/tree/main/packages/graphql-server).
