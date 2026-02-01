import type { SqlErrorReason } from "@comity/sql/errors";

export const ERROR_MESSAGES: Record<SqlErrorReason, string> = {
  cancelled: "Operation cancelled",
  timeout: "Operation timed out",
  "invalid-query": "Invalid SQL query",
  "connection-failed": "Database connection failed",
  "transaction-failed": "Transaction failed",
  "query-failed": "Query failed",
};
