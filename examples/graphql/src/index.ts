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
