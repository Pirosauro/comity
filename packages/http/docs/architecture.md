# @comity/http — Architecture

This document describes the architecture and design principles of the `@comity/http` module.

---

## Scope and Intent

`@comity/http` is an **HTTP runtime module**, not a web framework.

Its responsibility is to:

- execute an HTTP request through a deterministic pipeline
- coordinate middleware execution
- manage request-scoped state
- produce a final `HttpResult`

It explicitly does **not**:

- bind to any HTTP server or runtime (Node, Deno, Bun, Cloudflare, etc.)
- implement adapters (Hono, Express, Fetch, etc.)
- implement transports (fetch, undici, node http, etc.)
- perform rendering or serialization
- define business or domain logic

Adapters live in separate packages (e.g. `@comity/http-hono`).
Transports live in separate packages (e.g. `@comity/http-fetch` implements the `HttpTransport` contract).

---

## Architectural Model

The module is based on a **Pipeline + Middleware** model.

```
Adapter
  ↓
HttpFacade.handle(ctx)
  ↓
HttpPipeline
  ↓
Middleware (ordered, async)
  ↓
HttpContext.setResponse(...)
  ↓
HttpResult
```

### Key properties

- Middleware are executed **sequentially**
- Middleware may:
  - read request data
  - mutate shared state
  - emit events
  - finalize the response
- Once a response is finalized, execution stops

---

## Core Concepts

### HttpContext

`HttpContext` represents a **single HTTP request execution**.

It contains:

- an immutable request snapshot
- a mutable response (once)
- a mutable request-scoped state
- an abort signal
- an event emission mechanism

The context is created by the runtime and passed through the pipeline.

---

### HttpPipeline

`HttpPipeline` is responsible for:

- enforcing middleware execution order
- guaranteeing `next()` contract correctness
- preventing multiple response finalization

It does not know about adapters or transports.

---

### HttpMiddleware

A middleware is an async function with signature:

```ts
(ctx, next) => Promise<void>;
```

Important rules:

- `next()` may be called **at most once**
- Middleware **must not return a response**
- To short-circuit execution, middleware must call `ctx.setResponse(...)`

This ensures a single, explicit response ownership model.

---

### HttpResult vs HttpResponse

- `HttpResponse` represents a **successful HTTP response**
- `HttpResult` is a **success / failure envelope**

```ts
HttpResult =
  | { ok: true; response: HttpResponse }
  | { ok: false; error: unknown }
```

This separation allows:

- uniform error handling
- transport-agnostic failures
- adapter-specific rendering strategies

---

## Lifecycle & Events (High-Level)

The HTTP runtime may emit events during execution:

- request started
- request completed
- request failed

Events are **observational only**:

- they must not influence control flow
- they must not mutate context

Lifecycle integration is optional and typically handled by the kernel.

---

## Internal vs Public APIs

- `contracts/*` → public and stable
- `lifecycle/*` → public but optional
- `internal/*` → implementation details, not part of the API

Consumers should depend only on contracts.

---

## Design Principles

- No fake domain abstractions
- Explicit control flow
- Adapter isolation
- Event-driven observability
- Minimal but strict contracts

---

## Summary

`@comity/http` is a composable HTTP execution engine.

It provides structure, not policy.
