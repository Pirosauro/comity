# HttpError – Definitive Design

`HttpError` is the HTTP-aware error representation for `@comity/http`. It is
transport-agnostic but includes the intended HTTP status so adapters can map it
directly to their response model.

---

## Core Concepts

| Concept      | Responsibility               |
| ------------ | ---------------------------- |
| HttpError    | What went wrong (HTTP-aware) |
| HttpResult   | Success or failure outcome   |
| HttpResponse | Final HTTP output            |

---

## HttpError

📄 `src/core/error.ts`

```ts
export interface HttpError {
  /**
   * Stable error code (machine readable).
   */
  code: string;

  /**
   * HTTP status to return.
   */
  status: number;

  /**
   * Stable human-readable message (optional).
   */
  message?: string;

  /**
   * Optional structured details.
   */
  details?: unknown;

  /**
   * Original error (never serialized).
   */
  cause?: unknown;
}
```

### Design Notes

- `code` is **machine-oriented**
- `status` is **transport-aware** and required
- `message` is **human-oriented**
- `details` is **structured**
- `cause` is **opaque**

---

## Suggested Error Factories (optional)

Factories are not shipped. A common pattern:

```ts
import type { HttpError } from "@comity/http";

export const badRequest = (message = "Bad request", details?: unknown): HttpError => ({
  code: "bad_request",
  status: 400,
  message,
  details,
});

export const internalError = (cause: unknown, message = "Internal error"): HttpError => ({
  code: "internal_error",
  status: 500,
  message,
  cause,
});
```

---

## HttpResult (Union)

📄 `src/core/result.ts`

```ts
import type { HttpError } from "./error.js";

export type HttpResult =
  | {
      ok: true;
      response: HttpResponse;
    }
  | {
      ok: false;
      error: HttpError;
    };
```

---

## Mapping Errors to Responses

`@comity/http` does not ship a mapper. Adapters (e.g. `@comity/http-hono`) own
mapping to a transport-specific response. Because `HttpError` is already
HTTP-aware, most mappers become straightforward.

Example (pseudo):

```ts
const mapError = (error: HttpError) => ({
  status: error.status,
  body: {
    error: error.code,
    message: error.message,
    ...(error.details ? { details: error.details } : {}),
  },
});
```

---

## Pipeline Integration

Typical flow with the built-in pipeline runtime:

```ts
import { createHttpPipeline } from "@comity/http";

const errorMiddleware = async (ctx, next) => {
  try {
    await next();
  } catch (cause) {
    ctx.setResponse({
      ok: false,
      error: { code: "internal_error", status: 500, cause },
    });
  }
};

const pipeline = createHttpPipeline(errorMiddleware, handler);
const result = await pipeline.execute(ctx);
```

Finalization (adapter-owned):

```ts
if (!result.ok) {
  const response = mapError(result.error);
  ctx.setResponse({ ok: true, response });
}
```

---

## Events

Errors should be emitted **before mapping**:

```ts
ctx.emit({
  type: "http:error",
  requestId: ctx.request.id,
  code: error.code,
  message: error.message,
});
```

---

## Summary

- `HttpError` = HTTP-aware semantic/infra failure
- `HttpResult` = pipeline outcome (union)
- Mapping to transport lives in adapters (e.g. `@comity/http-hono`)
