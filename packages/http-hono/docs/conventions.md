# @comity/http-hono — Conventions

This document defines the operational conventions for the `@comity/http-hono` adapter.

---

## 1. Adapter Scope

`@comity/http-hono` is an adapter, not a core module.

It is responsible for:

- mapping Hono `Context` to `HttpContext`
- invoking `HttpFacade.handle(ctx)`
- mapping `HttpResult` to a Hono/Web `Response`

It does not own HTTP business rules, routing policy, or domain behavior.

---

## 2. Error Handling

- The adapter MAY catch thrown errors to translate them into an HTTP response.
- The adapter MUST NOT expose a public adapter-specific domain error contract.
- The adapter MUST rely on the errors exported by the `@comity/http` layer or by `BaseError` when mapping failures.
- Internal mapping helpers MAY exist, but they remain implementation details.

---

## 3. Public Surface

- The public API must stay small.
- Type exports exist only when they are required to wire the adapter or its kernel setup.
- `internal/` is not part of the public contract.

---

## 4. Dependency Rules

- The adapter depends on `@comity/http`, `@comity/kernel`, and `@comity/primitives`.
- The adapter MUST NOT introduce business logic.
- The adapter MUST NOT depend on application code.

---

## 5. Non-Goals

- not a router
- not a middleware system
- not a rendering layer
- not a domain policy layer
