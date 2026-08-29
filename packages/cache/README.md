# @comity/cache

Cache contracts, facade, and stores for Comity.

---

## Purpose

Provides the core cache model used to describe cache entries, cache stores, and the module setup required to wire caching into Comity applications.

---

## Scope

This package:

- ✅ defines cache contracts and store abstractions
- ✅ provides cache key serialization helpers
- ✅ exposes the default cache facade and module setup types

This package does NOT:

- ❌ bind to a specific cache backend
- ❌ implement application policy
- ❌ own persistence beyond the cache abstraction

---

## Public API

- Cache contracts
- Cache store contract
- Default cache facade
- Cache key serialization
- Cache store implementations (`@comity/cache/stores`)
- Error types (`@comity/cache/errors`)
- Module setup contracts (`@comity/cache/setup`)


No exhaustive reference; see docs for constraints.
---

## Documentation

- docs/overview.md
- docs/conventions.md
- docs/architecture.md

---

## Related Packages

- @comity/kernel
- @comity/composition
- @comity/primitives

---

## Status

Stable

_Review Completed: 2026-07-25_
_Reviewer: Hobiri MAGI (DeepSeek v4 Pro)_
_Compliance Score: 99.5% (Green)_
