# Comity Graphql Handler

A [Hono](https://hono.dev) middleware for handling GraphQL requests, seamlessly integrated with [Envelop](https://the-guild.dev/graphql/envelop) to provide enhanced GraphQL server capabilities.

## Features

- **High Performance**: Built on Hono, ensuring minimal overhead and blazing-fast performance.
- **Extensible**: Leverage Envelop plugins to enhance your GraphQL server with features like caching, tracing, error handling, and more.
- **Lightweight**: Designed to be simple and efficient, with a focus on developer experience.

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
import { Hono, type Context } from 'hono';
import {
  buildSchema,
  execute,
  parse,
  subscribe,
  validate,
  specifiedRules,
} from 'graphql';
import { graphqlHandler } from '@comity/graphql';
import { useLogger, useEngine, useSchema } from '@envelop/core';

const app = new Hono();
const schema = buildSchema(`
  type Query {
    hello: String
  }
`);

const rootResolver = (c: Context) => {
  return {
    hello: () => 'Hello World!',
  };
};

app.use(
  '/graphql',
  graphqlHandler({
    schema,
    rootResolver,
    plugins: [
      useLogger(),
      useEngine({ parse, validate, specifiedRules, execute, subscribe }),
      useSchema(schema),
    ],
  })
);

app.fire();
```

## Credits

Based on the original work by [Minghe Huang](https://github.com/honojs/middleware/tree/main/packages/graphql-server).
