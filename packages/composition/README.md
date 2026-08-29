# @comity/composition

Module composition primitive for Comity.

---

## Purpose

Defines the contracts and runtime utilities used to load, resolve, and compose Comity modules. Provides module metadata, setup context, and dependency resolution without owning kernel lifecycle or event orchestration.

---

## Scope

This package:

- ✅ defines module metadata and setup context contracts
- ✅ provides module loading and dependency resolution
- ✅ exposes composition primitives for lower layers

This package does NOT:

- ❌ manage runtime lifecycle or initialization
- ❌ emit or observe events
- ❌ own service registration or shared contexts

---

## Public API

- Module contracts — metadata and setup function types
- Loader — module loading primitive
- Resolver — dependency resolution
- Error types (`@comity/composition/errors`)
- Setup — module metadata and context types (`@comity/composition/setup`)

No exhaustive reference; see docs for constraints.

---

## Documentation

- docs/overview.md
- docs/conventions.md

---

## Related Packages

- @comity/kernel — application runtime lifecycle container
- @comity/primitives — foundational building blocks
- @comity/cache — cache contracts and stores

---

## Status

Stable

_Review Completed: 2026-07-25_
_Reviewer: Hobiri MAGI (DeepSeek v4 Pro)_
_Compliance Score: 99.5% (Green)_