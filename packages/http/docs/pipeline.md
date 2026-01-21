# HTTP Pipeline & Middleware Contracts

This document defines the **pipeline execution model** for `@comity/http`.

The pipeline is the **core orchestration mechanism** used to:
- process incoming HTTP requests
- apply cross-cutting concerns (auth, validation, logging, etc.)
- produce a final `HttpResult`
- emit lifecycle events

This is **not a domain pipeline**.
It is a **technical execution pipeline**, optimized for composability and observability.

---

## Design Principles

1. **Single Context**
   - A single `HttpContext` flows through the entire pipeline
   - No request/response cloning

2. **Explicit Termination**
   - A middleware may terminate the pipeline by setting a response

3. **Error Boundary at the Edge**
   - Middleware may throw
   - Pipeline runner converts errors into `HttpResult`

4. **Event-Friendly**
   - Every stage is observable
   - Core does not emit events directly

5. **Framework-Agnostic**
   - No dependency on Node, Fetch, Hono, Express, etc.

---

## Core Contracts

### HttpMiddleware

A middleware is a **composable unit of execution**.

```ts
import type { HttpContext } from "../core/context.js";

export type HttpMiddleware = (
  ctx: HttpContext,
  next: HttpNext
) => Promise<void> | void;
```

### HttpNext

`next()` transfers control to the next middleware in the pipeline.

```ts
export type HttpNext = () => Promise<void>;
```

---

## Execution Semantics

Middleware execution follows **onion model semantics**:

```
→ middleware A
  → middleware B
    → middleware C
    ← middleware C
  ← middleware B
← middleware A
```

Example:

```ts
const middleware: HttpMiddleware = async (ctx, next) => {
  // before
  await next();
  // after
};
```

---

## Short-Circuiting the Pipeline

A middleware may **terminate the pipeline** by setting a response:

```ts
ctx.setResponse({
  ok: false,
  error: {
    code: "unauthorized",
    status: 401,
  },
});
```

Rules:
- If `ctx.response` is set, `next()` **must not be called**
- The pipeline runner MUST stop execution

---

## Pipeline Runner Contract

The pipeline runner is responsible for:
- executing middleware in order
- handling errors
- ensuring a final `HttpResult`

### HttpPipeline

```ts
import type { HttpMiddleware } from "./middleware.js";
import type { HttpContext } from "../core/context.js";
import type { HttpResult } from "../core/result.js";

export interface HttpPipeline {
  execute(ctx: HttpContext): Promise<HttpResult>;
}
```

---

## Reference Pipeline Implementation

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

        if (ctx.response) return;

        await fn(ctx, () => dispatch(i + 1));
      };

      await dispatch(0);

      if (!ctx.response) {
        return {
          ok: false,
          error: {
            code: "http:no_response",
            status: 500,
            message: "Pipeline completed without a response",
          },
        };
      }

      return ctx.response;
    },
  };
}
```

---

## Error Handling Strategy

| Layer | Responsibility |
|-----|----------------|
Middleware | Throw or set response |
Pipeline | Catch unhandled errors |
Boundary Adapter | Serialize response |

### Why middleware can throw

- Keeps middleware simple
- Avoids defensive error wrapping everywhere
- Centralizes error normalization

---

## Event Integration

The pipeline **does not emit events directly**.

Instead:
- Middleware emits events explicitly
- The pipeline runner may emit lifecycle events (optional)

Example middleware emitting an event:

```ts
const loggingMiddleware: HttpMiddleware = async (ctx, next) => {
  ctx.state.set("start", Date.now());

  await next();

  const duration = Date.now() - (ctx.state.get("start") as number);
  ctx.events.emit("@comity/http:request_completed", {
    method: ctx.request.method,
    url: ctx.request.url.toString(),
    duration,
  });
};
```

---

## What Does NOT Belong in Middleware

❌ Business logic  
❌ Persistence  
❌ Authentication state mutation  
❌ Framework-specific logic  

Those belong to:
- adapters
- services
- external modules (`@comity/auth`, etc.)

---

## Summary

- Middleware is **technical orchestration**
- Pipeline is **deterministic and explicit**
- Context is **the single source of truth**
- Errors are **data, not control flow**
- Events are **opt-in and explicit**

This design intentionally mirrors the philosophy of `@comity/auth`,
while remaining fully infrastructure-focused.