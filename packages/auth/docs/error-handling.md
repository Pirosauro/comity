# Comity Auth – Error Handling Style Guide

## Scope

This document defines **how errors are represented and propagated in the Auth core**, and how adapters must interact with them.

This applies **only to the Auth module core**.

---

## 1. Design goals

The Auth core must be:

- **Pure and deterministic**
- **Framework-agnostic** (no HTTP, RPC, Workers assumptions)
- **Composable** (usable in CLI, workers, APIs)
- **Auditable** (clear invariants, no hidden control flow)

From these goals derive all constraints below.

---

## 2. Core rule: the core never throws

### Allowed in core

- Return values
- Structured `Result` objects
- Discriminated unions

### Forbidden in core

- `throw`
- Framework-oriented errors
- HTTP-like status codes
- Logging side effects

### Rationale

Throwing errors:

- introduces implicit control flow
- makes validation non-composable
- couples the core to runtime semantics

Therefore:

> **The Auth core always returns data, never control flow.**

---

## 3. Validation output model

All validation functions return:

```ts
{
  ok: true;
  value: T;
}
```

or

```ts
{
  ok: false;
  reason: AuthInvariantViolation;
}
```

This makes:

- failures explicit
- behavior testable
- adapters fully in control

---

## 4. Why not `BaseError` in the core

### Problem with `BaseError`

Using `BaseError` in the core would:

- introduce an **error taxonomy dependency**
- force a **global error code system**
- bias the core toward transport-level semantics

Auth invariants are **domain facts**, not runtime failures.

Example:

> “Session expired” is not an error.
> It is a **state**.

States must be represented as data, not exceptions.

---

## 5. Where `BaseError` is allowed

### Adapters only

Adapters are responsible for:

- mapping invariant violations to transport errors
- attaching status codes
- logging
- observability

Example:

```ts
const result = validateAuthPayload(payload, policy);

if (!result.ok) {
  throw new AuthError("AUTH_INVALID", {
    reason: result.reason,
  });
}
```

The adapter owns the error semantics.

---

## 6. Optional helper: `assertValidAuth`

An optional helper may:

- throw a **generic** `Error`
- include structured data via `cause`

Example:

```ts
throw new Error("AUTH_INVALID", { cause: result.reason });
```

### Constraints

- Must live outside core validation logic
- Must not be used internally by the core
- Exists only as an adapter convenience

---

## 7. Final rules summary

| Layer    | Can throw | Error types allowed |
| -------- | --------- | ------------------- |
| Core     | Never     | None                |
| Helpers  | Optional  | `Error` only        |
| Adapters | Yes       | `BaseError`, HTTP   |

---

## 8. Non-negotiable invariant

> **Auth core expresses truth. Adapters express consequences.**

This separation is mandatory.
