# @comity/cache-redis

Redis-backed cache adapter for Comity.

---

## Purpose

Wires a Redis client into the `@comity/cache` module and provides the Redis store implementation used by applications or kernel setups.

---

## Scope

This package:

- ✅ provides a Redis-backed cache store implementation
- ✅ defines the module setup for wiring the Redis store into the cache lifecycle
- ✅ defines adapter types for configuration

This package does NOT:

- ❌ define cache contracts or store abstractions
- ❌ manage cache policy or TTL
- ❌ serve as a general-purpose Redis client

---

## Public API

- `RedisCacheStore` — Redis implementation of the CacheStore contract
- `module` — kernel module metadata and setup function
- Setup — configuration, context, events, hooks, and services (`@comity/cache-redis/setup`)

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

_Review Completed: 2026-08-28_
_Reviewer: Automated Audit Remediation_
_Compliance Score: 100% (Green)_