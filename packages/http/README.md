# @comity/http

HTTP module for Comity framework applications

---

## Purpose

Provides a transport-agnostic HTTP pipeline with middleware, lifecycle events, and explicit response handling.

---

## Responsibilities

- ✅ Executes HTTP requests through an ordered middleware pipeline
- ✅ Manages request-scoped context and state
- ✅ Produces a structured `HttpResult`
- ✅ Emits lifecycle events for observability
- ❌ Does not bind to any HTTP server or runtime
- ❌ Does not implement adapters (Hono, Fetch, etc.)
- ❌ Does not perform rendering or serialization

---

## Architecture

The module is based on a Pipeline + Middleware model.

Adapters translate incoming requests into an `HttpContext`,
invoke the pipeline, and render the resulting `HttpResult`.

---

## Documentation

- `docs/overview.md`
- `docs/conventions.md`
- `docs/architecture.md`
- `docs/events.md`

---

## Status

Stable
