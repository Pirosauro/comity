import { describe, expect, it } from "vitest";
import { getGraphQLParams } from "../get-graphql-params.js";

describe("getGraphQLParams", () => {
  it("should return correct GraphQLParams from URL and body", async () => {
    const request = new Request(
      'http://example.com/graphql?query={test}&variables={"test":"value"}&operationName=testOperation',
      {
        method: "POST",
        body: JSON.stringify({
          query: "{test}",
          variables: { test: "value" },
          operationName: "testOperation",
          raw: true,
        }),
        headers: { "Content-Type": "application/json" },
      }
    );
    const params = await getGraphQLParams(request);

    expect(params).toEqual({
      query: "{test}",
      variables: { test: "value" },
      operationName: "testOperation",
      raw: true,
    });
  });

  it("should handle invalid JSON variables", async () => {
    const request = new Request(
      "http://example.com/graphql?variables=invalidJSON",
      {
        method: "POST",
        body: JSON.stringify({}),
        headers: { "Content-Type": "application/json" },
      }
    );

    await expect(getGraphQLParams(request)).rejects.toThrow(
      "Variables are invalid JSON."
    );
  });

  it("should return null for missing query, variables, and operationName", async () => {
    const request = new Request("http://example.com/graphql", {
      method: "POST",
      body: JSON.stringify({}),
      headers: { "Content-Type": "application/json" },
    });
    const params = await getGraphQLParams(request);

    expect(params).toEqual({
      query: null,
      variables: null,
      operationName: null,
      raw: false,
    });
  });

  it("should prioritize URL params over body params", async () => {
    const request = new Request(
      'http://example.com/graphql?query={urlQuery}&variables={"url":"value"}&operationName=urlOperation',
      {
        method: "POST",
        body: JSON.stringify({
          query: "{bodyQuery}",
          variables: { body: "value" },
          operationName: "bodyOperation",
          raw: true,
        }),
        headers: { "Content-Type": "application/json" },
      }
    );
    const params = await getGraphQLParams(request);

    expect(params).toEqual({
      query: "{urlQuery}",
      variables: { url: "value" },
      operationName: "urlOperation",
      raw: true,
    });
  });
});
