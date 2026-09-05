# Comity Coding Standards — Errors

> **Note:** This is the Community-specific transitional copy. The canonical Comity-wide version is maintained in `comity-development/docs/standards/errors.md`
This document defines the **official error model** for all Comity packages.

These rules apply to:

- Core packages `@comity/*`
- Infrastructure and adapter packages
- Future official extensions

Errors are part of the public contract. Inconsistent errors are considered **API bugs**.

---

# 1. Error Philosophy

Comity errors are:

- **Semantic**, not technical
- **Stable**, not incidental
- **Machine-readable first**
- **Transport-agnostic**, even when carrying transport hints

Errors represent:

> What went wrong — not how it was handled.

If an error cannot be named precisely, it should not exist.

---

# 2. BaseError Is Mandatory

All errors MUST extend `BaseError` from:

```
@comity/primitives/errors
```

❌ Forbidden:

```ts
throw new Error("something went wrong");
```

❌ Forbidden:

```ts
throw "error";
```

✅ Required:

```ts
throw new AuthError("invalid_credentials");
```

---

# 3. The Standard Error Model

Each module MAY define a domain error when they own domain failures. Infrastructure-contract modules SHOULD reuse shared errors.

---

## 3.1 Canonical Structure

Each module error must follow this pattern:

```ts
/**
 * Reasons for EventBus errors.
 */
export type EventBusErrorReason = "handler_failed";

/**
 * Stable default messages for each reason.
 */
const REASON_MESSAGES: Record<EventBusErrorReason, string> = {
  handler_failed: "Event handler failed",
};

/**
 * EventBus Error.
 */
export class EventBusError extends BaseError {
  readonly code: `event-bus:${EventBusErrorReason}`;

  constructor(reason: EventBusErrorReason, meta?: ErrorMeta) {
    super(REASON_MESSAGES[reason], {
      ...meta,
      reason,
    });

    this.code = `event-bus:${reason}`;
  }
}
```

---

# 4. Error Properties (Canonical Shape)

Every error instance MUST contain:

| Field         | Type               | Purpose                   |
| ------------- | ------------------ | ------------------------- |
| `code`        | `namespace:reason` | Stable machine identifier |
| `message`     | string             | Human-readable message    |
| `meta`        | structured object  | Structured metadata       |
| `meta.reason` | union literal      | Canonical machine reason  |

---

## 4.1 `code`

- Must follow: `namespace:reason`
- Must be derived from the `reason`
- Must never change once published

Examples:

```
auth:invalid_credentials
sql:timeout
http:not_found
di:not_registered
```

---

## 4.2 `reason`

- Machine-readable
- Finite union type
- Stable across versions
- Used for logic and branching

Example:

```ts
export type SqlErrorReason = "connection_failed" | "timeout" | "invalid_query";
```

---

## 4.3 `message`

- Default message must exist
- Must be neutral and professional
- Must not expose internals
- Must not contain identifiers, SQL, stack traces, etc.

Examples:

| Reason          | Message                   |
| --------------- | ------------------------- |
| `invalid_input` | "Invalid input"           |
| `unauthorized`  | "Authentication required" |
| `forbidden`     | "Access denied"           |
| `not_found`     | "Resource not found"      |
| `timeout`       | "Operation timed out"     |

---

## 4.4 `meta`

`meta` MAY include:

- contextual IDs
- correlation IDs
- adapter name
- transport hints (e.g., `httpStatus`)
- retriable flag
- safe diagnostic fields

It MUST NOT include:

- stack traces
- raw queries
- credentials
- secrets
- sensitive tokens

---

# 5. HTTP Status Is a Hint

Errors MAY include `httpStatus` inside `meta`.

Rules:

- It is a mapping hint
- It must not introduce transport coupling
- Non-HTTP consumers may ignore it

Example:

```ts
meta: {
  httpStatus: 404;
}
```

The error remains transport-agnostic.

---

# 6. One Error Class per Module

Each module MUST expose:

- ONE public error class
- ONE finite `Reason` union
- A stable namespace

Examples:

- `AuthError`
- `SqlError`
- `HttpError`
- `DiError`
- `EventBusError`

❌ Forbidden:

- `InvalidInputError`
- `ConflictError`
- `SessionExpiredError`
- Class explosion patterns

If two errors share the same recovery strategy, they must share the same reason.

---

# 7. Primitives Errors Policy

`@comity/primitives/errors` may contain:

- `BaseError`
- (Optionally) a minimal set of generic, transport-agnostic errors

However:

- New modules MUST NOT introduce new global generic errors.
- Module-specific semantics belong inside module-specific error classes.

The direction of the framework is:

> Prefer namespaced module errors over global generic errors.

---

# 8. Internal Errors

Internal errors:

- Must not be exported
- Must not be documented
- Must not leak outside the module boundary
- May extend `BaseError` or reuse module error

Use them only for invariant violations.

---

# 9. Error Explosion Rule

Creating a new error class is allowed ONLY if:

- The semantic meaning differs
- The recovery strategy differs
- The namespace differs

Otherwise:

Use a new `reason` in the module’s single error class.

Error explosion is considered API pollution.

---

# 10. Versioning Rules

- Adding a new `reason` → MINOR version bump
- Removing or renaming a `reason` → MAJOR version bump
- Changing default message wording (without semantic change) → PATCH
- Changing namespace → MAJOR

Error contracts are part of the public API.

---

# 11. Event + Error Interaction

Errors may be emitted through events.

When emitting:

- Prefer emitting `{ code, reason }`
- Avoid sending full error objects
- Never emit stack traces or sensitive metadata

---

# 12. Forbidden Patterns

❌ Throwing raw `Error` ❌ Multiple public error classes per module ❌ Dynamic or unstable `code` values ❌ Encoding dynamic data in `message` ❌ Transport-specific errors (e.g., `HttpNotFoundError`) ❌ Per-case micro error classes

---

# Final Principle

> Errors are part of the language of the system.

A Comity error must be:

- Predictable
- Namespaced
- Minimal
- Machine-readable
- Stable across time

If an error cannot be precisely categorized into a finite semantic reason, the design is incomplete.
