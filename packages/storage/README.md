# @comity/storage

Storage module for Comity.

---

## Purpose

Defines storage contracts, stores, and setup wiring for Comity applications. Provides storage options, CRUD operations, and signed URLs in a storage-independent manner.

---

## Scope

This package:

- ✅ defines storage, store, and options contracts
- ✅ provides a default storage facade with CRUD operations
- ✅ exposes `error`, `hooks`, and `setup` subpaths
- ✅ offers the `stores` subpath for store implementations

This package does NOT:

- ❌ implement a specific storage backend
- ❌ manage file upload or download protocols
- ❌ own binary content persistence

---

## Public API

- `Storage` — unified storage interface contract
- `StorageStore` — storage store adapter contract
- `DefaultStorage` — standard CRUD implementation
- Storage options — type handle for create, read, update, delete, and signed URL parameters
- `STORAGE_TOKEN` — DI token for storage wiring
- Error types (`@comity/storage/errors`)
- Setup — module wiring tokens (`@comity/storage/setup`)
- Store implementations (`@comity/storage/stores`)

No exhaustive reference; see docs for constraints.

---

## Documentation

- docs/overview.md
- docs/conventions.md
- docs/architecture.md

---

## Related Packages

- @comity/kernel — module lifecycle runtime

---

## Status

Stable

_Review Completed: 2026-07-25_
_Reviewer: Hobiri MAGI (DeepSeek v4 Pro)_
_Compliance Score: 99.5% (Green)_