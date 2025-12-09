import { ErrorContext } from "../types.js";

const map: Record<string, ErrorContext> = {
  // Authentication & Token errors
  TOKEN_EXPIRED: "auth",
  TOKEN_MALFORMED: "auth",
  INVALID_REFRESH_TOKEN: "auth",
  TOKEN_MISSING: "auth",

  // Authorization & Permissions
  ACCESS_DENIED: "auth",
  INVALID_CREDENTIALS: "auth",

  // Query validation (GraphQL specific)
  QUERY_DEPTH_EXCEEDED: "query",
  QUERY_COMPLEXITY_EXCEEDED: "query",
  QUERY_BREADTH_EXCEEDED: "query",
  GRAPHQL_SYNTAX_ERROR: "query",
  METHOD_NOT_ALLOWED: "query",
  EMPTY_QUERY: "query",

  // Input validation
  INPUT_LIST_EMPTY: "input",
  INPUT_LIST_MIN: "input",
  INPUT_LIST_MAX: "input",
  INPUT_INVALID: "input",

  // System & Infrastructure
  UNKNOWN_ERROR: "system",
  CONTEXT_ERROR: "system",
  MAX_PAYLOAD_EXCEEDED: "system",
  UNDER_MAINTENANCE: "system",
  REQUEST_LIMIT: "system",
  EXECUTION_ERROR: "system",

  // HTTP/Request level
  BAD_REQUEST: "http",
  NOT_FOUND: "http",
  FORBIDDEN: "http",
  UNAUTHORIZED: "http",
  INTERNAL_SERVER_ERROR: "http",
};

export const getErrorContext = (code: string): ErrorContext => {
  return map[code] || "system";
};
