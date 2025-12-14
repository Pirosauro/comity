import type { GraphQLError } from "graphql";
import type { ContentfulStatusCode } from "hono/utils/http-status";

const ERROR_CODE_TO_STATUS: Record<string, ContentfulStatusCode> = {
  // Authentication errors
  TOKEN_EXPIRED: 401,
  TOKEN_MALFORMED: 401,
  INVALID_REFRESH_TOKEN: 401,
  TOKEN_MISSING: 401,
  AUTHENTICATION_FAILED: 401,
  INVALID_SIGNATURE: 401,

  // Authorization errors
  ACCESS_DENIED: 403,
  INVALID_CREDENTIALS: 401,
  INSUFFICIENT_PERMISSIONS: 403,
  UNAUTHORIZED_OPERATION: 403,

  // Input validation errors
  INPUT_INVALID: 400,
  INPUT_TYPE_MISMATCH: 400,
  INPUT_REQUIRED: 400,
  INPUT_FORMAT_INVALID: 400,
  VARIABLE_TYPE_MISMATCH: 400,
  VARIABLE_MISSING: 400,
  INPUT_LIST_EMPTY: 400,
  INPUT_LIST_MIN: 400,
  INPUT_LIST_MAX: 400,

  // Query validation errors
  GRAPHQL_SYNTAX_ERROR: 400,
  GRAPHQL_VALIDATION_ERROR: 400,
  EMPTY_QUERY: 400,
  INVALID_OPERATION: 400,
  METHOD_NOT_ALLOWED: 405,
  QUERY_DEPTH_EXCEEDED: 400,
  QUERY_COMPLEXITY_EXCEEDED: 400,
  QUERY_BREADTH_EXCEEDED: 400,
  NON_NULLABLE_FIELD: 400,
  FIELD_NOT_FOUND: 400,

  // System errors
  CONTEXT_ERROR: 500,
  SCHEMA_BUILD_ERROR: 500,
  DATABASE_ERROR: 500,
  NETWORK_ERROR: 503,
  TIMEOUT_ERROR: 504,
  MAX_PAYLOAD_EXCEEDED: 413,
  UNDER_MAINTENANCE: 503,
  REQUEST_LIMIT: 429,
  EXECUTION_ERROR: 500,

  // HTTP errors
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  FORBIDDEN: 403,
  UNAUTHORIZED: 401,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
};

export function determineHttpStatus(
  errors: readonly GraphQLError[] | GraphQLError[]
): ContentfulStatusCode {
  if (!errors.length) return 200;

  let highestStatus: ContentfulStatusCode = 200;

  // Check each error for status codes
  for (const error of errors) {
    const extensions = error.extensions || {};

    // Check for explicit status in extensions
    const explicitStatus = extensions.status as
      | ContentfulStatusCode
      | undefined;
    if (explicitStatus && explicitStatus >= 400) {
      if (explicitStatus > highestStatus) {
        highestStatus = explicitStatus;
      }
      continue;
    }

    // Check for error code mapping
    const errorCode = extensions.code as string | undefined;
    if (errorCode) {
      const mappedStatus = ERROR_CODE_TO_STATUS[errorCode];

      if (mappedStatus && mappedStatus > highestStatus) {
        highestStatus = mappedStatus;
      }
    }

    // Check for specific GraphQL error types
    if (
      error.message.includes("Syntax Error") ||
      error.message.includes("Unexpected")
    ) {
      highestStatus = Math.max(highestStatus, 400) as ContentfulStatusCode;
    }

    // Check for validation errors
    if (
      error.message.includes("Cannot query field") ||
      error.message.includes("Unknown type")
    ) {
      highestStatus = Math.max(highestStatus, 400) as ContentfulStatusCode;
    }

    // Check for authentication/authorization errors
    if (
      error.message.includes("Unauthorized") ||
      error.message.includes("Forbidden")
    ) {
      highestStatus = Math.max(highestStatus, 401) as ContentfulStatusCode;
    }
  }

  return highestStatus;
}
