# @comity/http

HTTP module for Comity framework applications.

---

## Purpose

Provides a transport-agnostic HTTP pipeline with middleware, lifecycle events, and explicit response handling. It defines contracts for adapters and facades without binding to any specific server/runtime.

---

## Scope

This package:

- ✅ executes HTTP requests through an ordered middleware pipeline
- ✅ manages request-scoped context and state
- ✅ produces a structured HttpResult
- ✅ emits lifecycle events for observability

This package does NOT:

- ❌ bind to any HTTP server or runtime
- ❌ implement adapters (Hono, Fetch, etc.)
- ❌ perform rendering or serialization
- ❌ encode application business rules

---

## Public API

- Contracts — request, context, result, middleware, pipeline
- Facade — lifecycle-aware orchestrator that executes the pipeline
- Lifecycle — request lifecycle events
- Setup — kernel module metadata and setup function

---

## Documentation

- `docs/overview.md`
- `docs/conventions.md`
- `docs/architecture.md`
- `docs/events.md`

---

## Related Packages

- @comity/kernel
- @comity/http-hono
- @comity/primitives

---

## Status

Stable

_Review Completed: July 25, 2026_
_Reviewer: Hobiri MAGI (DeepSeek v4 Pro)_
_Compliance Score: 99.5% (Green)_
