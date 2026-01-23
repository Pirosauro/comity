# HttpFacade

`HttpFacade` is the **public entrypoint** of `@comity/http`.

It exposes a **stable, framework-agnostic API** to:
- register middleware
- execute HTTP pipelines
- adapt external requests into `HttpContext`

It deliberately **hides pipeline internals** and **adapter details**.

---

## Design Goals

1. **Single public abstraction**
2. **No domain leakage**
3. **Composable & event-driven**
4. **Adapter-friendly**
5. **Minimal surface area**

---

## Responsibility Boundaries

| Layer | Responsibility |
|-----|----------------|
HttpFacade | Public API |
Pipeline | Execution model |
Middleware | Cross-cutting logic |
Adapter | Framework binding (Hono, Fetch, etc.) |

---

## HttpFacade Contract

```ts
import type { HttpMiddleware } from "../pipeline/http-middleware.js";
import type { HttpContext } from "../core/http-context.js";
import type { HttpResult } from "../core/http-result.js";

export interface HttpFacade {
  /**
   * Registers one or more middleware.
   *
   * Order matters.
   */
  use(...middleware: readonly HttpMiddleware[]): void;

  /**
   * Executes the HTTP pipeline.
   *
   * Used by adapters to process a request.
   */
  handle(ctx: HttpContext): Promise<HttpResult>;
}
```

---

## Why only `use()` and `handle()`?

Because:
- Everything else is an implementation detail
- The HTTP module is infrastructure, not business logic
- This mirrors how HTTP servers actually work

Anything more would be **leaking framework concerns**.

---

## Reference Implementation

```ts
import type { HttpFacade } from "../contracts/http-facade.js";
import type { HttpMiddleware } from "../pipeline/http-middleware.js";
import type { HttpContext } from "../core/http-context.js";
import type { HttpResult } from "../core/http-result.js";
import type { HttpPipeline } from "../pipeline/http-pipeline.js";

export class DefaultHttpFacade implements HttpFacade {
  #middleware: HttpMiddleware[] = [];

  constructor(private readonly pipelineFactory: (mw: HttpMiddleware[]) => HttpPipeline) {}

  use(...middleware: readonly HttpMiddleware[]): void {
    this.#middleware.push(...middleware);
  }

  async handle(ctx: HttpContext): Promise<HttpResult> {
    const pipeline = this.pipelineFactory(this.#middleware);
    return pipeline.execute(ctx);
  }
}
```

---

## Pipeline Factory Pattern (Why?)

We **do not reuse the same pipeline instance**, because:

- Middleware list is mutable
- Pipelines are execution artifacts
- Avoid shared state bugs

Example factory:

```ts
const pipelineFactory = (mw: HttpMiddleware[]) =>
  new DefaultHttpPipeline([...mw]);
```

---

## Adapter Usage Example

### Hono Adapter (conceptual)

```ts
app.all("*", async (c) => {
  const ctx = honoToHttpContext(c);

  const result = await http.handle(ctx);

  return httpResultToHonoResponse(result);
});
```

Adapters:
- never touch middleware
- never execute policies
- never handle errors manually

---

## Event Emission

`HttpFacade` itself **does not emit events**.

Events are emitted by:
- middleware
- adapters
- pipeline runner (optional, internal)

This mirrors `@comity/auth`:
> Facade orchestrates, others observe.

---

## Comparison with AuthFacade

| AuthFacade | HttpFacade |
|-----------|------------|
Business entrypoint | Infrastructure entrypoint |
Use-case oriented | Pipeline oriented |
Strong domain | No domain |
Policy-driven | Middleware-driven |

Same **mental model**, different **nature**.

---

## What Does NOT Belong in HttpFacade

❌ Routing  
❌ Error mapping  
❌ Serialization  
❌ Authentication  
❌ Framework logic  

Those belong to:
- middleware
- adapters
- external modules

---

## Summary

- `HttpFacade` is intentionally small
- Pipeline & middleware are the real engine
- Adapters are thin
- Events stay explicit
- No fake domain abstractions

This keeps `@comity/http` **clean, flexible, and future-proof**.