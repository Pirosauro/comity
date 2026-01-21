# HTTP Pipeline & Middleware – Definitive Design

This document defines the final Pipeline & Middleware architecture for
`@comity/http`.

The design is **infrastructure-first**, **event-driven**, and intentionally
does **not** introduce a fake domain layer.

---

## Design Goals

- Deterministic request execution
- Composable middleware
- Explicit lifecycle
- Event-driven observability
- Framework-agnostic core
- Single response ownership

---

## Mental Model

```
Incoming Request
   ↓
HttpContext
   ↓
Middleware 1
   ↓
Middleware 2
   ↓
...
   ↓
Middleware N
   ↓
HttpResult
```

Middleware can:
- read request
- mutate state
- short-circuit the pipeline
- emit events
- set the final response

---

## Core Contracts

### HttpMiddleware

📄 `src/pipeline/middleware.ts`

```ts
import type { HttpContext } from "../core/context.js";

export type HttpMiddleware = (
  ctx: HttpContext,
  next: HttpNext
) => Promise<void> | void;
```

---

### HttpNext

📄 `src/pipeline/middleware.ts`

```ts
export type HttpNext = () => Promise<void>;
```

---

### Middleware Rules

1. Middleware **MUST** call `next()` unless:
   - it sets a response
   - it throws
2. Middleware **MUST NOT** call `next()` more than once
3. Middleware **MUST NOT** modify `ctx.request`
4. Middleware **MUST NOT** override an existing response

---

## HttpPipeline

📄 `src/pipeline/http.ts`

```ts
import type { HttpContext } from "../core/context.js";
import type { HttpMiddleware } from "./middleware.js";
import type { HttpResult } from "../core/result.js";

export interface HttpPipeline {
  /**
   * Executes the middleware chain.
   */
  execute(ctx: HttpContext): Promise<HttpResult>;
}
```

---

## Default Pipeline Runtime

📄 `src/runtime.ts`

```ts
export function createHttpPipeline(
  ...middleware: readonly HttpMiddleware[]
): HttpPipeline {
  return {
    async execute(ctx: HttpContext): Promise<HttpResult> {
      let index = -1;

      const dispatch = async (i: number): Promise<void> => {
        if (i <= index) {
          throw new Error("next() called multiple times");
        }
        index = i;
        const fn = middleware[i];
        if (!fn) return;
        await fn(ctx, () => dispatch(i + 1));
      };

      await dispatch(0);

      if (!ctx.response) {
        throw new Error("HTTP response not set");
      }

      return ctx.response;
    },
  };
}
```

---

## Response Handling Contract

### Single Ownership Rule

- `ctx.setResponse()` may be called **once**
- First caller wins
- Second call **throws**

This guarantees:
- deterministic output
- predictable control flow
- no middleware races

---

## Error Handling Strategy

Middleware may throw.

Thrown errors are:
- caught by the adapter (e.g. `@comity/http-hono`)
- mapped via `HttpErrorMapper`
- converted to `HttpResult`
- emitted as events

The pipeline itself does **not** swallow errors.

---

## Short-Circuiting

Example:

```ts
export const authMiddleware: HttpMiddleware = async (ctx, next) => {
  if (!ctx.state.get("user")) {
    ctx.setResponse({
      status: 401,
      body: { error: "unauthorized" }
    });
    return;
  }

  await next();
};
```

---

## Event Emission

Middleware can emit events via `ctx.emit()`:

```ts
ctx.emit({
  type: "http:middleware_executed",
  at: Date.now(),
  requestId: ctx.request.id
});
```

The core does not define event semantics.

---

## Typical Middleware Types

| Type | Responsibility |
|----|----|
| Logging | request/response tracing |
| Parsing | body parsing |
| Auth | identity resolution |
| Authorization | permission checks |
| Validation | input validation |
| Routing | endpoint dispatch |
| Error | fallback / catch-all |

---

## What Pipeline Does NOT Do

- No routing
- No serialization
- No error mapping
- No status inference
- No auth logic

These belong to:
- middleware
- adapters
- external modules

---

## Relationship with Adapters

Adapters (Hono, Express, Fetch):

- build `HttpContext`
- execute pipeline
- observe events
- send final response

Core pipeline is **adapter-agnostic**.

---

## Comparison with @comity/auth

| @comity/auth | @comity/http |
|-------------|--------------|
| Use cases | Middleware |
| Policies | Interceptors |
| Domain errors | Infra errors |
| Facade | Facade |
| Event-driven | Event-driven |

Same philosophy, different nature.

---

## Summary

The HTTP pipeline is:

- minimal
- explicit
- deterministic
- extensible
- observable

It intentionally avoids introducing a fake domain layer while remaining
structurally consistent with the rest of Comity.

---

Next steps:
- `HttpResult`
- `HttpErrorMapper`
- `HttpFacade`
- `@comity/http-hono` adapter