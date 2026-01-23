# HttpContext

`HttpContext` represents the execution context of a single HTTP request.

It is created by an adapter and passed through the pipeline.

---

## Structure

```ts
interface HttpContext {
  readonly request: HttpRequest;
  response?: HttpResult;
  readonly state: Map<string, unknown>;
  readonly signal: AbortSignal;

  setResponse(result: HttpResult): void;
}
```

---

## Request

`request` is immutable and contains:

- Request identifier
- HTTP method
- URL
- Headers
- Query parameters
- Path parameters
- Optional body

Middleware MUST treat request data as read-only.

---

## Response

`response` is optional and may be set **once**.

Rules:

- Setting the response terminates the pipeline
- Attempting to set it twice throws an error
- Middleware MUST use `setResponse()`

---

## State

`state` is a mutable key-value store shared across middleware.

Use cases:

- Authentication results
- Rate limiting metadata
- Correlation data

Avoid:

- Storing large objects
- Persisting state beyond request scope

---

## Abort Signal

`signal` is used to detect:

- Client disconnects
- Timeouts
- Adapter-level cancellation

Middleware SHOULD respect `signal.aborted`.

---

## Events

The context exposes an event emitter used for:

- Observability
- Tracing
- Metrics

Events MUST NOT affect control flow.
