# Error Mapping

This adapter guarantees that all failures are normalized into `SqlError`
from `@comity/sql`.

## Canonical error reasons

| Failure type                 | SqlError.reason          |
| ---------------------------- | ------------------------ |
| Connection failure           | sql:connection-failed    |
| SQL syntax error             | sql:invalid-query        |
| Constraint / execution error | sql:query-failed         |
| Transaction commit/rollback  | sql:transaction-failed   |
| Query timeout                | sql:timeout              |
| Explicit cancellation        | sql:cancelled            |

## Security considerations

- SQL queries MUST NOT be included in error metadata
- Parameters MUST NOT be logged
- Error meta must be safe for logs and telemetry

The adapter may include:

- operation type
- adapter name
- retriable flag
