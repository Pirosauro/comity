# @comity/kernel

Runtime orchestrator for Comity applications.

---

## Purpose

Provides a minimal orchestration layer that coordinates module lifecycle, service registration, and event/hook signaling without imposing a framework or runtime model. The kernel is optional.

---

## Scope

This package:

- ✅ manages application lifecycle and initialization
- ✅ coordinates module setup and shared context
- ✅ exposes lifecycle events (observable) and hook execution (participatory)

This package does NOT:

- ❌ perform UI rendering or transport concerns
- ❌ manage HTTP or external protocols
- ❌ encode application or domain policies

---

## Public API

- Kernel — orchestrator with lifecycle control and context
- Module — metadata, resolver, and loader contracts


No exhaustive reference; see docs for constraints.
---

## Documentation

- [`docs/overview.md`](./docs/overview.md)
- [`docs/conventions.md`](./docs/conventions.md)
- [`docs/lifecycle.md`](./docs/lifecycle.md)
- [`docs/events.md`](./docs/events.md)

---

## Related Packages

- @comity/primitives
- @comity/http

---

## Status

Stable

_Review Completed: 2026-07-25_
_Reviewer: Hobiri MAGI (DeepSeek v4 Pro)_
_Compliance Score: 99.6%_
