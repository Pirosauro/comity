# @comity/cache-redis

Redis-backed cache adapter for Comity.

---

## Purpose

Wires a Redis client into the `@comity/cache` module and provides the Redis store implementation used by applications or kernel setups. The package does not expose an `index.ts` barrel; it provides expose via `setup/`.

---

## Scope

This package:

- provides a Redis-backed cache store implementation
- defines the module setup for wiring the Redis store into the cache lifecycle
- defines adapter types for configuration

This package does NOT:

- define cache contracts or store abstractions
- manage cache policy or TTL
- serve as a general-purpose Redis client

---

## Public API

- `module` — kernel module metadata and setup function
- setup types — configuration, context, events, hooks, and services

No exhaustive reference; see docs for constraints.

---

## Documentation

- docs/overview.md
- docs/conventions.md

---

## Related Packages

- @comity/cache — cache contracts and store interfaces
- @comity/kernel — module lifecycle runtime

---

## Status

Stable

_Review Completed: 2026-07-25_
_Reviewer: Hobiri MAGI (DeepSeek v4 Pro)_
_Compliance Score: 99.5% (Green)_