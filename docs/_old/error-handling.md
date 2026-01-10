# Comity – Error Handling Rules

This document defines **mandatory rules** for error modeling and usage in Comity.

It **does not replace** the Code Review Checklist: it **completes it** by providing explicit guidance on how errors must be designed, structured, and propagated across layers.

These rules apply to **all packages** unless explicitly stated otherwise.

---

## 1. Core Principles

### 1.1 Errors are part of the public contract

Errors are **not implementation details**. They are:

- part of the module API
- consumed by adapters
- relied upon for control flow, observability, and policy decisions

As such, errors must be **predictable, typed, and stable**.

---

### 1.2 Errors are machine-oriented

In Comity:

- error messages are **machine-readable**, not human-friendly
- human rendering is **explicitly delegated to adapters** (HTTP, CLI, UI)

**Never encode human explanations inside error messages.**

---

### 1.3 Every error must be meaningful in isolation

An error instance must carry enough structured information to be:

- logged
- serialized
- mapped to transport-specific representations

Without relying on stack traces or surrounding context.

---

## 2. BaseError (Mandatory)

### 2.1 All domain and application errors MUST extend BaseError

Any error that is:

- intentionally thrown
- part of a public API
- expected to be handled upstream

**MUST extend `BaseError`.**

Exceptions:

- native runtime errors (e.g. `TypeError`, `SyntaxError`)
- truly unexpected bugs (these must NOT be caught and rethrown)

---

### 2.2 BaseError responsibilities

`BaseError` provides:

- a stable `code`
- structured `meta`
- optional causal chaining (`cause`)

All subclasses MUST define:

- `readonly code: string`

---

## 3. Error Message Rules

### 3.1 Message format

The `message` of a `BaseError` MUST:

- be machine-oriented
- be stable across releases
- follow a namespaced, dot-separated format

**Recommended pattern:**

```
<domain>.<reason>
```

Examples:

- `kernel.not_sealed`
- `acl.forbidden`
- `database.connection_failed`

---

### 3.2 Forbidden content in messages

The message MUST NOT:

- contain natural language sentences
- include variable values
- mention UI concepts
- attempt to explain how to fix the issue

❌ Invalid:

- "User does not have permission"
- "Cannot resolve service before kernel is sealed"

✅ Valid:

- `acl.forbidden`
- `kernel.not_sealed`

---

## 4. Error Codes

### 4.1 Code vs message

- `code` identifies the **error class**
- `message` identifies the **specific condition**

They MUST NOT be interchangeable.

Example:

- `code`: `kernel:invalid-state`
- `message`: `kernel.not_sealed`

---

### 4.2 Code stability

Error codes:

- MUST be stable
- MUST NOT encode contextual data
- MAY be used for metrics, alerts, and policy checks

Changing an error code is a **breaking change**.

---

## 5. Error Metadata (`meta`)

### 5.1 Purpose

`meta` exists to carry **structured, adapter-agnostic context**.

It is the primary vehicle for:

- diagnostics
- observability
- human rendering (via adapters)

---

### 5.2 Rules for meta

`meta`:

- MUST be serializable
- MUST NOT contain functions
- MUST NOT contain circular references
- SHOULD be shallow

---

### 5.3 Mandatory fields

If the error is expected to cross a boundary (e.g. HTTP), `meta` SHOULD include:

- `httpStatus` (number)

This field:

- MUST NOT be inferred by adapters
- MUST be explicit at error creation time

---

## 6. httpStatus Rules

### 6.1 Ownership

The module that **owns the error** is responsible for defining its `httpStatus`.

Adapters must **map**, not **guess**.

---

### 6.2 When httpStatus is required

`httpStatus` is REQUIRED when:

- the error is part of application flow
- the error can reach an HTTP adapter

It MAY be omitted for:

- purely internal errors
- errors guaranteed to be handled before transport

---

## 7. Generic vs Dedicated Errors

### 7.1 Dedicated errors (preferred)

Create a dedicated error class when:

- the error represents a distinct domain rule
- callers may want to discriminate on it
- the error has domain-specific metadata

Example:

- `AclForbiddenError`
- `KernelStateError`

---

### 7.2 Generic errors (allowed, but limited)

Generic errors are acceptable ONLY when:

- the failure is truly infrastructural
- no domain semantics are attached

Examples:

- configuration loading failure
- environment variable missing

Even generic errors MUST extend `BaseError`.

---

### 7.3 Anti-pattern

❌ One generic error class with many meanings differentiated only by message.

---

## 8. Error Propagation Rules

### 8.1 Do not wrap blindly

Errors MUST NOT be wrapped unless:

- adding meaningful domain context
- crossing a bounded context boundary

When wrapping:

- preserve `cause`
- do not lose the original error

---

### 8.2 Do not downgrade errors

Adapters MUST NOT:

- replace `BaseError` with generic errors
- stringify errors prematurely

Adapters may only:

- translate errors
- render errors
- enrich logs

---

## 9. Layer Responsibilities

| Layer         | Responsibility               |
| ------------- | ---------------------------- |
| Core / Domain | Define error semantics       |
| Application   | Select and propagate errors  |
| Adapters      | Render, translate, serialize |

Adapters MUST NOT invent domain meaning.

---

## 10. Review Checklist (Error-Specific)

During code review, **reject changes** if:

- an intentional error does not extend `BaseError`
- error message is human-readable
- `httpStatus` is missing where required
- error meaning is encoded only in the message
- multiple failure modes reuse a single vague error

---

## 11. Guiding Principle

> **If an adapter cannot reliably decide what to do with an error by inspecting its type, code, and meta, the error is incorrectly designed.**

---

End of document.
