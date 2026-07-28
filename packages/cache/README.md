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
- Module setup contracts

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
