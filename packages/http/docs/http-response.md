---
id: http-response
status: authoritative
version: 1.0.0
owner: @architecture-council
enforcement: block
last_reviewed: 2026-01-12
next_reviewed: 2027-01-12
---

# HTTP Response Contract (`@comity/http`)

## Purpose

This document defines the **canonical HTTP response contract** used by Comity applications.

It standardizes how application logic communicates **HTTP semantics** (status, body, headers, redirects, streaming) without coupling domain logic, kernel, or modules to a specific HTTP runtime or framework.

This is a **Level 3: Authoritative Standard**. Violations are considered architectural defects and block merges.

---

## Scope

This specification applies to:

- All code in `@comity/http`
- All application and module code that returns HTTP-facing results
- All HTTP adapters (Hono, Fetch, Node, Edge)

It does **not** apply to:

- Core domain logic
- Kernel lifecycle
- Non-HTTP adapters (CLI, queue, workers)

---

## Design Principles

1. **HTTP Is an Adapter Concern**  
   Domain logic and kernel code MUST NOT depend on HTTP runtimes or frameworks.

2. **Explicit Semantics Over Implicit Behavior**  
   HTTP status, body, and intent must be explicit in the response object.

3. **Single Canonical Output**  
   All HTTP-facing application logic MUST return a single `HttpResponse` object on success.

4. **Runtime Agnostic**  
   No native `Response`, `ReadableStream`, or framework-specific objects are allowed in contracts.

---

## Canonical Type: `HttpResponse`

`HttpResponse` is a discriminated union identified by the `kind` field.

```ts
export type HttpResponse =
  | HttpJsonResponse
  | HttpTextResponse
  | HttpHtmlResponse
  | HttpRedirectResponse
  | HttpStreamResponse;
```

---

## Response Variants

### JSON Response

```ts
export type HttpJsonResponse = {
  kind: "json";
  status: number;
  body: unknown;
  headers?: Record<string, string>;
};
```

- Default `Content-Type`: `application/json`
- Used for APIs and structured payloads

---

### Text Response

```ts
export type HttpTextResponse = {
  kind: "text";
  status: number;
  body: string;
  headers?: Record<string, string>;
};
```

- Default `Content-Type`: `text/plain; charset=utf-8`

---

### HTML Response

```ts
export type HttpHtmlResponse = {
  kind: "html";
  status: number;
  body: string;
  headers?: Record<string, string>;
};
```

- Default `Content-Type`: `text/html; charset=utf-8`
- Intended for rendered or templated HTML

---

### Redirect Response

```ts
export type HttpRedirectResponse = {
  kind: "redirect";
  status: 301 | 302 | 303 | 307 | 308;
  location: string;
  headers?: Record<string, string>;
};
```

- The `Location` header MUST be set by the adapter
- Body MUST be omitted

---

### Stream Response

```ts
export type HttpStreamResponse = {
  kind: "stream";
  status: number;
  body: HttpBodyStream;
  headers?: Record<string, string>;
};
```

Used for:

- File downloads
- Server-Sent Events (SSE)
- Large or incremental payloads

---

## Streaming Contract

### `HttpBodyStream`

```ts
export interface HttpBodyStream {
  onData(handler: (chunk: Uint8Array) => void): void;
  onEnd(handler: () => void): void;
  onError(handler: (error: Error) => void): void;
}
```

### Rules

1. Streams MUST be runtime-agnostic
2. Native streams (`ReadableStream`, Node streams) MUST NOT be exposed
3. Adapters are responsible for binding streams to the runtime

---

## Empty Responses

There is **no dedicated `empty` response kind**.

An empty response is inferred when:

- `body` is `undefined` or `null`
- OR `status` is `204` or `304`

Adapters MUST:

- Omit the response body
- Avoid setting `Content-Type`

---

## Integration With Result Pattern

All HTTP-facing application code MUST return:

```ts
Result<HttpResponse, BaseError>;
```

### Rules

- Successful execution returns `HttpResponse`
- Failures return a `BaseError`
- Adapters translate `BaseError` → HTTP error responses

---

## Adapter Responsibilities

Adapters (e.g. HonoAdapter):

- MUST inspect `HttpResponse.kind`
- MUST set correct headers and status codes
- MUST handle empty-body cases correctly
- MUST bind streams to the runtime
- MUST NOT mutate the response object

---

## Non-Goals

This contract explicitly does NOT define:

- Routing
- Middleware APIs
- Authentication or authorization
- Error rendering policies
- Framework-specific response objects

---

## Compliance Checklist

- No framework-specific objects in `HttpResponse`
- All HTTP responses use `kind`
- No HTTP logic in kernel or domain layers
- Streaming uses `HttpBodyStream`
- Success paths return `Result.success(HttpResponse)`

---

## Rationale

This design ensures:

- Clean hexagonal boundaries
- Predictable HTTP behavior
- Excellent developer experience
- Future-proofing across runtimes and transports

---

## Supersession

This is the initial version of the HTTP Response Contract. It supersedes no prior documents.
