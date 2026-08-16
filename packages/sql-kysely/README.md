# @comity/sql-kysely

Kysely adapter for @comity/sql.

---

## Purpose

Implements the SQL contracts from `@comity/sql` on top of Kysely. Maps Kysely operations to the SQL client and result contracts without exposing Kysely internals directly.

---

## Scope

This package:

- ✅ provides a Kysely-backed SQL client implementation
- ✅ maps Kysely errors to Comity SQL error types
- ✅ maps Kysely transactions to the SQL transaction contract

This package does NOT:

- ❌ define SQL contracts
- ❌ manage connection pools or pooling strategies
- ❌ expose Kysely internals through public contracts

---

## Public API

- `createKyselySqlClient` — factory that creates a Kysely-based SQL client

No exhaustive reference; see docs for constraints.

---

## Documentation

- docs/overview.md
- docs/conventions.md
- docs/architecture.md
- docs/error-mapping.md
- docs/transactions.md

---

## Related Packages

- @comity/sql — SQL contracts and error types

---

## Status

Stable

_Review Completed: 2026-07-25_
_Reviewer: Hobiri MAGI (DeepSeek v4 Pro)_
_Compliance Score: 99.5% (Green)_