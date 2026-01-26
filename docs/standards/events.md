# Comity Coding Standards — Events

This document defines the **official event model** for all Comity packages.

Events are a first-class concept in Comity and enable:

- Observability
- Extension
- Decoupled coordination between modules

Events are **signals**, not commands.

---

## 1. Event Philosophy

Comity events are:

- **Fire-and-forget**
- **Side-effect free**
- **Non-blocking**
- **Domain-relevant**

Events MUST NOT:

- Control execution flow
- Replace function calls
- Be required for correctness

If the system breaks without a listener, the event is wrong.

---

## 2. Event Ownership

Each module defines **its own events**.

Examples:

- `KernelEvents`
- `HttpEvents`
- `AuthEvents`

A module:

- Emits its own events
- Never emits events owned by another module

---

## 3. Event Shape

### Strongly Typed Interfaces (Preferred)

Events MUST be defined as interfaces with explicit methods:

```ts
export interface HttpEvents {
  requestStarted(payload: { id: string; method: string; path: string }): void;

  requestCompleted(payload: { id: string; status: number; duration: number }): void;

  requestFailed(payload: { id: string; errorCode: string; duration: number }): void;
}
```

This is the **canonical Comity pattern**.

---

## 4. Naming Rules

- Event names are **verbs in past tense**
- Payload names are **descriptive and minimal**

✅ Good:

- `requestStarted`
- `kernelSealed`
- `moduleRegistered`

❌ Bad:

- `onRequest`
- `handleRequest`
- `requestEvent`

---

## 5. Payload Rules (Security-Critical)

Event payloads MUST:

- Be safe to log
- Avoid sensitive data
- Avoid raw objects

### Forbidden in payloads

- Full request/response bodies
- Authentication secrets
- Stack traces
- Arbitrary `unknown` or `any` objects

❌ Forbidden:

```ts
requestCompleted({ result: HttpResult });
```

✅ Required:

```ts
requestCompleted({ status: 200, duration: 12 });
```

If in doubt: **pass identifiers, not objects**.

---

## 6. Error Events

When emitting error-related events:

- Emit error **codes**, not error instances
- Never emit raw `Error` objects

✅ Correct:

```ts
requestFailed({
  id: ctx.request.id,
  errorCode: error.code,
  duration,
});
```

❌ Forbidden:

```ts
requestFailed({ error });
```

---

## 7. Event Emission Responsibility

Events are emitted by:

- The module runtime
- Facades
- Kernel orchestrators

Events MUST NOT be emitted by:

- Domain entities
- Value objects
- Pure functions

---

## 8. Event Bus Integration

- Modules do NOT depend directly on a concrete event bus
- Events are emitted through:
  - Kernel-provided emitter
  - Adapter-provided emitter

Example:

```ts
ctx.emit({ type: "http:requestStarted", ... });
```

or via typed interfaces:

```ts
this.emitter.requestStarted(...)
```

---

## 9. Optional by Design

- Events MUST be optional
- No listener MUST be required
- No event MUST affect behavior

If listeners are required for correctness, the logic is misplaced.

---

## 10. Versioning & Stability

- Event names and payloads are part of the public API
- Changing an event signature is a **breaking change**
- Adding new events is **non-breaking**

---

## Summary

> Events describe **what happened**, never **what should happen next**.

If an event changes behavior, it is not an event.
