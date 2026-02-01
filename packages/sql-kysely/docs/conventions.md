# Conventions

Hard rules and constraints for @comity/sql-kysely.

---

## Allowed

- Immutable boundary types (readonly)
- Explicit success/failure via SqlOperationResult
- Capability-based transactions via SqlTransaction
- Adapter purity: no Kysely types in public API

---

## Forbidden

- Named parameters in queries (adapter supports positional only)
- Exposing driver/ORM types publicly
- Logging/metrics/tracing in adapter code
- Throwing errors for normal SQL failures

---

## Constraints

- Runtime-agnostic; Kysely is internal engine only
- Error reasons documented as kebab-case domain codes (sql:<error-kind>)
- Error meta must be non-sensitive (no SQL text or params)
