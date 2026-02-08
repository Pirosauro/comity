# Events

Observability-only events for @comity/sql.

---

## Philosophy

- Events do not affect control flow
- Payloads are minimal and non-sensitive
- Emission is implementation-defined and fire-and-forget

---

## Contracts

Interface: `SqlEvents`

- `queryStarted(payload: { id: string; text: string })`
- `queryCompleted(payload: { id: string; duration: number; rowCount?: number })`
- `queryFailed(payload: { id: string; reason: string; duration: number })`
- `transactionStarted(payload: { id: string })`
- `transactionCommitted(payload: { id: string; duration: number })`
- `transactionRolledBack(payload: { id: string; duration: number })`

---

## Constraints

- No request/response bodies or sensitive values
- No logging or metrics in core; adapters may emit
