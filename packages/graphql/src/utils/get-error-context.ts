import type { ErrorContext } from "../types.js";

const map: Record<string, ErrorContext> = {
  // Authentication & Token errors
  TOKEN_EXPIRED: "auth",
  TOKEN_MALFORMED: "auth",
  INVALID_REFRESH_TOKEN: "auth",
  TOKEN_MISSING: "auth",
  AUTHENTICATION_FAILED: "auth",
  INVALID_SIGNATURE: "auth",

  // Authorization & Permissions
  ACCESS_DENIED: "auth",
  INVALID_CREDENTIALS: "auth",
  INSUFFICIENT_PERMISSIONS: "auth",
  UNAUTHORIZED_OPERATION: "auth",

  // Query validation (GraphQL specific)
  QUERY_DEPTH_EXCEEDED: "query",
  QUERY_COMPLEXITY_EXCEEDED: "query",
  QUERY_BREADTH_EXCEEDED: "query",
  GRAPHQL_SYNTAX_ERROR: "query",
  GRAPHQL_VALIDATION_ERROR: "query",
  METHOD_NOT_ALLOWED: "query",
  EMPTY_QUERY: "query",
  INVALID_OPERATION: "query",
  NON_NULLABLE_FIELD: "query",
  FIELD_NOT_FOUND: "query",

  // Input validation
  INPUT_LIST_EMPTY: "input",
  INPUT_LIST_MIN: "input",
  INPUT_LIST_MAX: "input",
  INPUT_INVALID: "input",
  INPUT_TYPE_MISMATCH: "input",
  INPUT_REQUIRED: "input",
  INPUT_FORMAT_INVALID: "input",
  VARIABLE_TYPE_MISMATCH: "input",
  VARIABLE_MISSING: "input",

  // System & Infrastructure
  UNKNOWN_ERROR: "system",
  CONTEXT_ERROR: "system",
  SCHEMA_BUILD_ERROR: "system",
  MAX_PAYLOAD_EXCEEDED: "system",
  UNDER_MAINTENANCE: "system",
  REQUEST_LIMIT: "system",
  EXECUTION_ERROR: "system",
  DATABASE_ERROR: "system",
  NETWORK_ERROR: "system",
  TIMEOUT_ERROR: "system",

  // HTTP/Request level
  BAD_REQUEST: "http",
  NOT_FOUND: "http",
  FORBIDDEN: "http",
  UNAUTHORIZED: "http",
  INTERNAL_SERVER_ERROR: "http",
  SERVICE_UNAVAILABLE: "http",
  GATEWAY_TIMEOUT: "http",
};

export const getErrorContext = (code: string): ErrorContext => {
  return map[code] || "system";
};
