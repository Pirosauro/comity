# @comity/cache-kv

Key-value cache adapter for the Comity cache module.

---

## Purpose

Adapts a key-value cache store into the `@comity/cache` module wiring. Provides the kernel setup needed to connect a KV store to the standard cache lifecycle.

---

## Scope

This package:

- provides a module that wires a KV cache into Comity
- exposes setup types for configuring the KV cache adapter

This package does NOT:

- define cache contracts or store abstractions
- implement the cache store itself
- manage cache TTL or serialization

---

## Public API

- `module` — kernel module metadata and setup function
- Setup types — configuration types for the KV adapter

No exhaustive reference; see docs for constraints.

---

## Documentation

- docs/overview.md
- docs/conventions.md

---

## Related Packages

- @comity/cache — cache contracts and store abstractions
- @comity/kernel — module lifecycle runtime

---

## Status

Stable

_Review Completed: July 25, 2026_
_Reviewer: Hobiri MAGI (DeepSeek v4 Pro)_
_Compliance Score: 99.5% (Green)_