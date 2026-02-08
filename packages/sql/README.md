# @comity/sql

Minimal SQL boundary abstractions for Comity applications.

---

## Purpose

Define stable, immutable contracts for executing SQL, representing results, classifying failures, and expressing transactional capabilities.

---

## Scope

This package:

- ✅ defines SQL query, result, error, and transaction contracts
- ✅ provides an event model for observability only
- ✅ remains runtime- and framework-agnostic

This package does NOT:

- ❌ include schemas, migrations, entities, repositories
- ❌ provide database drivers or adapters
- ❌ include query builders or ORM features
- ❌ perform logging, metrics, or tracing

---

## Public API

High-level contracts:

- SqlQuery — immutable query payload
- SqlResult<T> — immutable result set
- SqlOperationResult<T> — explicit success/failure union
- SqlError/SqlErrorReason/SqlErrorMeta — structured error data
- SqlClient — query and transaction entry points
- SqlTransaction — explicit commit/rollback capability
- SqlEvents — observability-only events
- SqlClientOptions — minimal runtime-agnostic options

---

## Documentation

- docs/overview.md
- docs/conventions.md
- docs/events.md
- docs/architecture.md
- docs/decisions/errors-as-data.md
- docs/decisions/no-orm.md
- docs/decisions/no-query-builder.md
- docs/decisions/transactions-as-capabilities.md

---

## Related Packages

- @comity/kernel
- @comity/http

---

## Status

Stable
