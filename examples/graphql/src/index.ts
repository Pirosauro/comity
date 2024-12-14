import { Hono, type Context } from 'hono';
import {
  execute,
  parse,
  subscribe,
  validate,
  specifiedRules,
  GraphQLString,
  GraphQLObjectType,
  GraphQLSchema,
} from 'graphql';
import { graphqlHandler } from '@comity/graphql';
import { useLogger, useEngine, useSchema } from '@envelop/core';

const app = new Hono();
const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    hello: {
      type: GraphQLString,
      resolve: () => 'Hello, world!',
    },
  },
});
const schema = new GraphQLSchema({
  query: queryType,
});

app.use(
  '/graphql',
  graphqlHandler({
    schema,
    plugins: [
      useLogger(),
      useEngine({ parse, validate, specifiedRules, execute, subscribe }),
      useSchema(schema),
    ],
  })
);

app.fire();
