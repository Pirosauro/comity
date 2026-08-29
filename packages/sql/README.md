# @comity/sql

SQL boundary module for Comity.

---

## Purpose

Defines the contracts used to talk to SQL databases without binding Comity to a concrete driver or ORM. Provides client, transaction, and query contracts in addition to error types for SQL operations.

---

## Scope

This package:

- ✅ defines SQL client, transaction, and query contracts
- ✅ defines typed SQL result and operation result contracts
- ✅ exposes module-level error types via the `error` subpath
- ✅ offers `observers` subpath for lifecycle observability

This package does NOT:

- ❌ implement a concrete SQL driver or ORM
- ❌ manage connection pooling or credentials
- ❌ render database schema

---

## Public API

- `SqlClient`, `SqlClientOptions` — client contract and configuration
- `SqlTransaction` — transaction contract
- `SqlQuery` — query contract
- `SqlResult`, `SqlOperationResult` — typed result contracts
- Error types (`@comity/sql/errors`)
- Observers — SQL lifecycle observability (`@comity/sql/observers`)

No exhaustive reference; see docs for constraints.

---

## Documentation

- docs/overview.md
- docs/conventions.md
- docs/architecture.md
- docs/faq.md
- docs/observability.md

---

## Related Packages

- @comity/sql-kysely — Kysely SQL adapter

---

## Status

Stable

_Review Completed: 2026-07-25_
_Reviewer: Hobiri MAGI (DeepSeek v4 Pro)_
_Compliance Score: 99.5% (Green)_