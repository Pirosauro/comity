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
