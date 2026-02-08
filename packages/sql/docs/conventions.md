# Conventions

Hard rules and constraints for @comity/sql.

---

## Allowed

- Immutable boundary types (readonly)
- Explicit success/failure via SqlOperationResult
- Explicit transactional capability via SqlTransaction
- Observability-only events via SqlEvents

---

## Forbidden

- Schemas, migrations, entities, repositories
- Query builders, ORM features, change tracking
- Database drivers, pooling policies, global state
- Logging, metrics, tracing inside this package
- Throwing errors for normal SQL failures

---

## Constraints

- Framework-agnostic and runtime-agnostic
- Minimal, boring, explicit contracts
- No adapter imports in core
- Payloads must avoid sensitive data
