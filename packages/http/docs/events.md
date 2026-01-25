# @comity/http — Events & Lifecycle

This document defines the event model for the `@comity/http` module.

---

## Purpose of Events

HTTP events exist to support:

- logging
- metrics
- tracing
- debugging
- observability

They are **not** part of request control flow.

Events must never:

- mutate the `HttpContext`
- affect middleware execution
- influence the response

---

## Event Emission Model

Events are emitted by the HTTP runtime via the active event bus
(typically provided by `@comity/kernel`).

The runtime emits events using:

```ts
ctx.emit(event);
```

Event emission is:

- synchronous or async (implementation-defined)
- fire-and-forget
- non-blocking

---

## HttpEvent Contract

```ts
export interface HttpEvent {
  type: string;
  [key: string]: unknown;
}
```

Events are intentionally **loosely typed** to:

- avoid coupling
- support extension
- allow adapter- or app-specific payloads

---

## Standard HTTP Events

The following events are emitted by the core runtime.

### `http:request.started`

Emitted when request processing begins.

Payload:

```ts
{
  type: "http:request.started";
  id: string;
  method: string;
  path: string;
}
```

---

### `http:request.completed`

Emitted when a request completes successfully.

Payload:

```ts
{
  type: "http:request.completed";
  id: string;
  status: number;
}
```

Notes:

- Response body is never included
- Headers are intentionally excluded
- Intended for metrics and logging only

---

### `http:request.failed`

Emitted when request execution fails.

Payload:

```ts
{
  type: "http:request.failed";
  id: string;
  errorCode?: string;
}
```

Notes:

- Error details are intentionally minimal
- No stack traces or raw errors are emitted

---

## Security Considerations

Event payloads must:

- avoid sensitive data
- avoid request/response bodies
- avoid authentication tokens

Adapters or applications may enrich events **outside** the core runtime.

---

## Kernel Integration

When used with `@comity/kernel`:

- events are forwarded to the kernel event bus
- lifecycle ordering is preserved
- HTTP events coexist with other module events

Kernel integration is optional.

---

## Summary

HTTP events provide observability, not control.

If an action must affect request execution, it belongs in middleware —
not in events.
