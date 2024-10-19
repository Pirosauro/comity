import type { GraphQLParams } from "../types";
import { parseBody } from "./parse-body.js";

export const getGraphQLParams = async (
  request: Request
): Promise<GraphQLParams> => {
  const urlData = new URLSearchParams(request.url.split("?")[1]);
  const bodyData = await parseBody(request);

  // GraphQL Query string.
  let query = urlData.get("query") ?? (bodyData.query as string | null);

  if (typeof query !== "string") {
    query = null;
  }

  // Parse the variables if needed.
  let variables = (urlData.get("variables") ?? bodyData.variables) as {
    readonly [name: string]: unknown;
  } | null;
  if (typeof variables === "string") {
    try {
      variables = JSON.parse(variables);
    } catch {
      throw Error("Variables are invalid JSON.");
    }
  } else if (typeof variables !== "object") {
    variables = null;
  }

  // Name of GraphQL operation to execute.
  let operationName =
    urlData.get("operationName") ?? (bodyData.operationName as string | null);
  if (typeof operationName !== "string") {
    operationName = null;
  }

  const raw = urlData.get("raw") != null || bodyData.raw !== undefined;

  const params: GraphQLParams = {
    query: query,
    variables: variables,
    operationName: operationName,
    raw: raw,
  };

  return params;
};
