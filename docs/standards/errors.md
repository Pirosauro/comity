# Comity Coding Standards — Errors

This document defines the **official error model** for all Comity packages.

These rules apply to:

- Core packages `@comity/*`
- Adapters and infrastructure packages

Errors are part of the public contract. Inconsistent errors are considered **API bugs**.

---

## 1. Error Philosophy

Comity errors are:

- **Semantic**, not technical
- **Predictable**, not ad-hoc
- **Transport-agnostic**, even when they carry hints for transports

Errors represent **what went wrong**, not **how it was handled**.

---

## 2. BaseError Is Mandatory

All errors MUST extend `BaseError` from `@comity/primitives/errors`.

❌ Forbidden:

```ts
throw new Error("something went wrong");
```

✅ Required:

```ts
throw new InvalidLifecycleStateError({...});
```

---

## 3. Error Shape

Every error MUST define:

- `code` — stable, namespaced identifier (`module:reason`)
- `message` — human-readable, safe to log
- `meta` — optional structured metadata

```ts
export class ForbiddenError extends BaseError {
  readonly code = "core:forbidden";

  constructor(message = "Access denied", meta: ErrorMeta = {}) {
    super(message, { httpStatus: 403, ...meta });
  }
}
```

---

## 4. HTTP Status Is a Hint, Not a Dependency

- Errors MAY include `httpStatus` in metadata
- Errors MUST NOT depend on HTTP semantics
- Non-HTTP consumers MAY ignore it

```ts
meta: {
  httpStatus: 404;
}
```

This is a **mapping hint**, not a contract.

---

## 5. Default Messages (Mandatory)

Every public error MUST define a default message.

Rules:

- Neutral, professional tone
- No implementation details
- No internal identifiers
- No stack or system info

Examples:

| Error             | Default Message             |
| ----------------- | --------------------------- |
| BadRequestError   | `"Invalid request"`         |
| UnauthorizedError | `"Authentication required"` |
| ForbiddenError    | `"Access denied"`           |
| NotFoundError     | `"Resource not found"`      |
| ConflictError     | `"Resource conflict"`       |
| TimeoutError      | `"Operation timed out"`     |
| InternalError     | `"Internal error"`          |

---

## 6. Error Scope Rules

### Public Errors

- Declared in `@comity/primitives`
- Stable and documented
- Usable across modules

### Module Errors

- Namespaced (`http:*`, `auth:*`)
- May extend primitives
- Not re-exported by other modules

### Internal Errors

- Never exported
- Never documented
- Used only for invariants

---

## 7. Error Pollution Rules

- Do NOT create new errors unless semantics differ
- Prefer reusing existing primitives
- Error explosion is considered API pollution

If two errors map to the same recovery action, they should be the same error.

---

## 8. Event + Error Interaction

- Errors may be emitted as events
- Event payloads MUST NOT include:
  - stack traces
  - sensitive metadata
- Prefer error `code` over full error object

---

## Summary

> Errors are part of the language of the system.

If an error cannot be named, it does not exist.
