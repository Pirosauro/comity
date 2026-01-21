# HttpResult – Definitive Design

`HttpResult` represents the **final HTTP outcome** produced by the pipeline.

It is:
- explicit
- adapter-agnostic
- serialization-agnostic

It is **not** a server response object and does not depend on a specific HTTP
framework.

---

## Design Goals

- Single source of truth for responses
- Explicit status & body
- Clear distinction between success & error
- Adapter-friendly
- Event-friendly

---

## Core Type

📄 `src/core/result.ts`

```ts
import type { HttpError } from "./error.js";

export type HttpResult =
  | { 
    /** Success result */
    ok: true; 

    /** Response */
    response: HttpResponse; 
  }
  | { 
    /** Failure result */
    ok: false; 
    
    /** Error */
    error: HttpError; 
  };

export interface HttpResponse {
  /** HTTP status code */
  status: number;

  /** HTTP headers */
  headers?: Record<string, string>;
  
  /** HTTP body */
  body?: unknown;
}
```

---

Why:
- Simple union signals success vs failure
- Adapter can map to transport response
- Serializable and framework-agnostic

---

## Success vs Error

The union makes success vs failure explicit:

| Concern | Location |
|------|------|
| Error semantics | HttpError |
| Error mapping | Adapter / mapper |
| Transport formatting | Adapter |
| Result | Union |

---

## Construction Helpers

Helpers are not shipped. Common patterns:

```ts
export const ok = (body?: unknown): HttpResult => ({
  ok: true,
  response: { status: 200, body },
});

export const badRequest = (message: string): HttpResult => ({
  ok: false,
  error: { code: "bad_request", status: 400, message },
});
```

---

## Serialization Responsibility

Adapters are responsible for:

- setting headers
- serializing body
- writing status
- handling streams

Example (Hono adapter pseudo-code):

```ts
if (result.ok) {
  return c.json(result.response.body, result.response.status);
}

return c.json(
  { error: result.error.code, message: result.error.message },
  result.error.status
);
```

---

## Relationship with HttpContext

```ts
ctx.setResponse({
  ok: true,
  response: { status: 200, body: { hello: "world" } }
});
```

Rules:
- response may be set once (enforced by `createHttpContext`)
- first writer wins

---

## Relationship with Errors

Errors are:

- thrown during pipeline execution
- mapped (by adapter) into `HttpResult` failures
- emitted as events

`HttpResult` is the **final representation**, not the error carrier.

---

## Event Emission Example

```ts
ctx.emit({
  type: "http:response_created",
  requestId: ctx.request.id,
  status: result.status,
});
```

---

## Why NOT Response / Fetch / Node Types?

Because:
- not portable
- not serializable
- not test-friendly
- leak infra concerns

`HttpResult` is the **boundary object**.

---

## Comparison with @comity/auth

| Auth | HTTP |
|----|----|
| AuthSession | HttpResult |
| Domain outcome | Infra outcome |
| Policy errors | Transport errors |
| Event emission | Event emission |

Same philosophy, different layer.

---

## Summary

`HttpResult` is:

- minimal
- explicit
- framework-agnostic
- the only allowed HTTP output

Everything else maps to it.

---

Next steps:
- `HttpError`
- `HttpErrorMapper`
- `HttpFacade`
- `@comity/http-hono` adapter