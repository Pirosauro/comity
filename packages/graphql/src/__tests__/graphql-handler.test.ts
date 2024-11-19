import type { Options } from "../../types";
import type { Context } from "hono";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { buildSchema, GraphQLError } from "graphql";
import { graphqlHandler } from "../graphql-handler.js";
import { ServiceError } from "../service-error.js";

describe("graphqlHandler", () => {
  let options: Options<any, any, {}>;
  let context: Context<any, any, {}>;

  beforeEach(() => {
    options = {
      schema: buildSchema(`
        type Query {
          test: String
        }`),
      rootResolver: (c) => ({ test: () => "value" }),
      pretty: false,
      validationRules: [],
      plugins: [],
    };

    context = {
      req: {
        method: "POST",
        raw: new Request("http://example.com/graphql", {
          method: "POST",
          body: JSON.stringify({
            query: "query testOperation { test }",
            variables: {},
          }),
          headers: { "Content-Type": "application/json" },
        }),
      },
      json: vi.fn(),
      text: vi.fn(),
    } as unknown as Context<any, any, {}>;
  });

  it("should return 405 for non-GET and non-POST methods", async () => {
    // @ts-ignore
    context.req.method = "PUT";

    const handler = graphqlHandler(options);

    await handler(context, vi.fn());

    expect(context.json).toHaveBeenCalledWith(
      new ServiceError("GraphQL only supports GET and POST requests."),
      405,
      { Allow: "GET, POST" }
    );
  });

  it("should return 400 for invalid JSON variables", async () => {
    context.req.raw = new Request("http://example.com/graphql", {
      method: "POST",
      body: JSON.stringify({
        query: "query testOperation { test }",
        variables: "invalidJSON",
      }),
      headers: { "Content-Type": "application/json" },
    });

    const handler = graphqlHandler(options);

    await handler(context, vi.fn());

    expect(context.json).toHaveBeenCalledWith(
      new ServiceError("Variables are invalid JSON."),
      400
    );
  });

  it("should return 400 for invalid query syntax", async () => {
    context.req.raw = new Request("http://example.com/graphql", {
      method: "POST",
      body: JSON.stringify({
        query: "{}",
        variables: {},
      }),
      headers: { "Content-Type": "application/json" },
    });

    const handler = graphqlHandler(options);

    await handler(context, vi.fn());

    expect(context.json).toHaveBeenCalledWith(
      new ServiceError("GraphQL syntax error."),
      400
    );
  });

  it("should return 500 for invalid schema", async () => {
    // @ts-expect-error
    options.schema = {};

    const handler = graphqlHandler(options);

    await handler(context, vi.fn());

    expect(context.json).toHaveBeenCalledWith(
      new ServiceError("GraphQL schema validation error."),
      500
    );
  });

  it("should return 400 for syntax errors in query", async () => {
    context.req.raw = new Request("http://example.com/graphql", {
      method: "POST",
      body: JSON.stringify({ query: "{ invalidQuery" }),
      headers: { "Content-Type": "application/json" },
    });

    const handler = graphqlHandler(options);

    await handler(context, vi.fn());

    expect(context.json).toHaveBeenCalledWith(
      new ServiceError("GraphQL syntax error."),
      400
    );
  });

  it("should return 400 for validation errors", async () => {
    options.validationRules = [
      (context) => ({
        Document(node) {
          context.reportError(new GraphQLError("Validation error."));

          return false;
        },
      }),
    ];

    const handler = graphqlHandler(options);

    await handler(context, vi.fn());

    expect(context.json).toHaveBeenCalledWith(
      new ServiceError("GraphQL validation error."),
      400
    );
  });

  // it("should return 405 for non-query operations in GET request", async () => {
  //   const url = new URL("http://example.com/graphql");

  //   url.searchParams.set("query", "mutation { test }");

  //   // @ts-ignore
  //   context.req.method = "GET";
  //   context.req.raw = new Request(url.toString(), {
  //     method: "GET",
  //     headers: { "Content-Type": "application/json" },
  //   });

  //   const handler = graphqlHandler(options);

  //   await handler(context, vi.fn());

  //   expect(context.json).toHaveBeenCalledWith(
  //     new ServiceError(
  //       "Can only perform a mutation operation from a POST request."
  //     ),
  //     405,
  //     { Allow: "POST" }
  //   );
  // });

  it("should return 400 for execution context errors", async () => {
    options.rootResolver = () => {
      throw new Error("Execution context error");
    };

    const handler = graphqlHandler(options);

    await handler(context, vi.fn());

    expect(context.json).toHaveBeenCalledWith(
      new ServiceError("GraphQL execution context error."),
      400
    );
  });

  it("should return formatted result for valid query", async () => {
    options.rootResolver = (c) => ({ test: () => "value" });

    const handler = graphqlHandler(options);

    await handler(context, vi.fn());

    expect(context.json).toHaveBeenCalledWith({ data: { test: "value" } });
  });
});
