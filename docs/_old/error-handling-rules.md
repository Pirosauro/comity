# Comity – Error Handling Rules (Authoritative)

This document complements the Code Review Checklist and defines **mandatory rules** for error handling across Comity packages.

---

## Principles

1. **Domain-first**
   Errors represent *conditions*, not transports.

2. **Stable identity**
   Every error has a stable, machine-readable `code`.

3. **Messages are human-readable and stable**

   * No interpolation
   * No dynamic values

4. **Metadata carries context**

   * Structured
   * Serializable
   * Optional

5. **Transport-agnostic**

   * HTTP status (if any) lives in `meta`
   * Mapping happens only in adapters

---

## BaseError (mandatory)

All framework errors **must** extend `BaseError`.

```ts
export abstract class BaseError extends Error {
  abstract readonly code: string;
  readonly meta: Record<string, unknown>;
}
```

---

## Allowed Error Types

Prefer **common errors**. Create new ones only if the semantic is stable and reusable.

* `NotFoundError`
* `ConflictError`
* `ValidationError`
* `ServiceUnavailableError`
* `UnexpectedError`

---

## When to Throw

| Situation                            | Error                     |
| ------------------------------------ | ------------------------- |
| Missing dependency                   | `NotFoundError`           |
| Duplicate registration               | `ConflictError`           |
| Invalid input/config                 | `ValidationError`         |
| Temporary subsystem failure          | `ServiceUnavailableError` |
| Broken invariant / should not happen | `UnexpectedError`         |

---

## Propagation Rules

* Do **not** swallow errors silently
* Do **not** rethrow generic `Error`
* Do **not** mutate existing errors
* Let errors propagate to adapters

---

## Event vs Hook Semantics

* **EventBus**: observational, fire-and-forget

  * Handler failures do **not** invalidate the caller
  * Errors must be *reported*, not propagated

* **HookBus**: transformational pipeline

  * Handler failures **must propagate**
  * Failure invalidates the operation

---

## Anti-patterns (Forbidden)

* `throw new Error(...)`
* HTTP-specific errors in core
* Dynamic messages
* Silent catch blocks

---

## Stability Guarantees

* Error `code` is stable across minor versions
* Metadata may evolve additively
* Message changes only in major versions

---

**This document is normative.**
