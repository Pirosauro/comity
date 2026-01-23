# Events

`@comity/http` emits events for **observability and diagnostics**.

Events are optional and MUST NOT affect request correctness.

---

## Event Philosophy

- Events are fire-and-forget
- No event listener may influence control flow
- The system must behave correctly even with zero listeners

---

## Naming Convention

All events emitted by this module use the prefix:

```
@comity/http:<category>_<action>
```

Examples:

- `@comity/http:request_started`
- `@comity/http:request_completed`
- `@comity/http:request_failed`
- `@comity/http:middleware_error`

---

## Who Can Emit Events

Events may be emitted by:

- Pipeline runtime
- Middleware
- Adapters

Events MUST NOT be emitted by:

- External consumers to influence behavior

---

## Payload Rules

Event payloads MUST:

- Be serializable
- Avoid raw request/response bodies unless strictly required
- Never contain secrets or credentials

Payloads SHOULD:

- Include request ID when available
- Include timing or diagnostic information

---

## Typical Use Cases

- Logging
- Tracing
- Metrics
- Auditing
- Debugging

Events are not a replacement for business logic.
