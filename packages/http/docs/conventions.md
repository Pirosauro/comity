# @comity/http – Conventions

This document defines **mandatory architectural and behavioral conventions**
for the `@comity/http` module.

These conventions are normative.  
Any deviation must be considered a design error.

---

## 1. Module Scope

`@comity/http` is an **infrastructure core module**.

It provides:

- HTTP execution pipeline
- Request execution context (`HttpContext`)
- Result and error model
- Event emission hooks

It does NOT provide:

- HTTP framework adapters (Hono, Express, Fetch, etc.)
- Rendering (HTML, React, JSX, templates)
- Routing, authentication, authorization
- Persistence or business logic

Framework adapters MUST live in separate modules
(e.g. `@comity/http-hono`).

---

## 2. Middleware Responsibilities

A middleware MAY:

- Read from `HttpContext.request`
- Mutate `HttpContext.state`
- Set `HttpContext.response` exactly once
- Emit events

A middleware MUST:

- Be side-effect free beyond the current request
- Be composable and order-agnostic
- Return control by calling `next()` unless terminating the pipeline

A middleware MUST NOT:

- Perform persistence
- Depend on framework-specific objects
- Call other middleware directly
- Assume it is the last middleware unless it sets the response

---

## 3. Response Ownership

`HttpContext.response` has **single ownership**.

Rules:

- Only one middleware may set the response
- Once set, the pipeline MUST stop
- Any further attempt to set the response MUST throw

This rule prevents race conditions and undefined behavior.

---

## 4. Error Handling

- Expected failures MUST be represented as `HttpError`
- Unexpected failures MUST be thrown as raw errors
- Middleware MUST NOT return `HttpResponse` directly

All errors are handled centrally by the pipeline.

---

## 5. State Management

`HttpContext.state` is a shared mutable map.

Rules:

- Keys SHOULD be namespaced (e.g. `auth.user`, `rate.limit`)
- Values MUST be request-scoped
- State MUST NOT be used for persistence

---

## 6. Events

Events are **observability tools**, not control flow.

Rules:

- Emitting events MUST NOT affect correctness
- Business logic MUST NOT depend on event listeners
- Events MUST be fire-and-forget

See `docs/events.md` for details.
