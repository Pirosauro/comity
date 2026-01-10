# Comity Error Handling & Core Contracts

## Status

**Authoritative** – This document supersedes any previous error-handling guidance.

---

## 1. Scope

This document defines:

- the **Comity error model** (domain-first)
- when to **throw errors vs return results**
- how core primitives (Container, EventBus, HookBus) behave
- how errors propagate across layers
- the role of contracts and adapters

It complements (and does not contradict) the **Code Review Checklist**.

---

## 2. Core Principles

### 2.1 Errors represent conditions, not transports

Errors describe **domain or system conditions**, not HTTP responses, CLI exits, or UI messages.

Adapters are responsible for mapping errors to:

- HTTP responses
- CLI exit codes
- log messages

The core is transport-agnostic.

---

### 2.2 Error identity is stable

Each error has a stable, machine-readable `code`.

```ts
error.code === "NOT_FOUND";
```

- Codes do not change across minor versions
- Codes are safe to branch on
- Messages are not used programmatically

---

### 2.3 Messages are human-readable but static

Error messages:

- are short
- are stable
- contain no interpolated values

Dynamic context is carried via metadata.

```ts
throw new NotFoundError("Service not registered", {
  service: "database",
});
```

---

### 2.4 Metadata carries context

Metadata:

- is structured
- is optional
- is safe to serialize
- may evolve additively

Typical metadata:

- identifiers
- configuration values
- domain-specific details

---

### 2.5 HTTP status is optional

HTTP status codes may be included **as metadata**, but are never required.

```ts
{
  httpStatus: 404;
}
```

The core never performs HTTP mapping.

---

## 3. BaseError

All framework errors extend `BaseError`.

```ts
export abstract class BaseError extends Error {
  abstract readonly code: string;
  readonly meta: Record<string, unknown>;
}
```

### Guarantees

- `code` is always present
- `meta` is always defined
- `cause` is preserved
- `name` matches the concrete class

---

## 4. Error Categories

Errors are classified by **intent**, not by architectural layer.

### 4.1 Domain errors

Represent expected business conditions.

Examples:

- not found
- conflict
- invalid state

These errors are:

- expected
- actionable
- safe to expose

---

### 4.2 System errors

Represent failures of the system or environment.

Examples:

- corrupted data
- invariant violations
- unexpected states

These errors are:

- not expected
- not recoverable
- wrapped to preserve the original cause

---

## 5. Common Errors

### NotFoundError

Used when a required resource does not exist.

```ts
throw new NotFoundError("Resource not found", {
  resource: "user",
  id: userId,
});
```

---

### ConflictError

Used when an operation cannot proceed due to an existing state.

```ts
throw new ConflictError("Service already registered", {
  service: key,
});
```

---

### ValidationError

Used when input or configuration is invalid.

```ts
throw new ValidationError("Invalid configuration", {
  field: "dependsOn",
});
```

---

### UnexpectedError

Safe boundary for failures that should not happen.

```ts
try {
  // unsafe operation
} catch (err) {
  throw new UnexpectedError("Failed to initialize module", {
    module: name,
    cause: err,
  });
}
```

---

## 6. Error Propagation Rules

### Allowed

- Let errors propagate
- Throw `BaseError`
- Wrap unknown errors once

### Forbidden

- Swallowing errors in the core
- Rethrowing plain `Error`
- Mutating existing errors

---

## 7. Error Decision Matrix

| Scenario                | Action                  | Rationale                   |
| ----------------------- | ----------------------- | --------------------------- |
| API misuse              | throw `BaseError`       | Fail fast, developer error  |
| Invariant violation     | throw `BaseError`       | Protect core integrity      |
| Expected domain failure | return `Result`         | Domain explicitly models it |
| Infrastructure failure  | throw `BaseError`       | Adapter decides recovery    |
| Unknown failure         | throw `UnexpectedError` | Safe boundary               |

**Rule**: the core never returns `Result` for structural or invariant failures.

---

## 8. Core Primitives Behavior

### 8.1 Container

- Throws on misuse (missing service, duplicate registration)
- Never returns `Result`
- Enforces invariants

### 8.2 EventBus

- Throws on invalid usage
- Does not swallow errors silently
- Does not map errors

### 8.3 HookBus

- Throws on invariant violations
- Sequential execution is guaranteed

---

## 9. Contracts

Contracts define **capabilities**, not policies.

### EventBusContract

```ts
export interface EventBusContract<TPayload = unknown> {
  subscribe(event: string, handler: EventHandler<TPayload>): Unsubscribe;

  emit(event: string, payload: TPayload): Promise<void>;
}
```

### Contract rules

- No `onError`
- No logging
- No retry semantics

---

## 10. Error Handling vs Adapters

Adapters are responsible for:

- rendering human-readable messages
- mapping errors to HTTP / CLI
- logging and observability

Example (HTTP):

```ts
switch (error.code) {
  case "NOT_FOUND":
    return res.status(404);
  case "CONFLICT":
    return res.status(409);
}
```

---

## 11. Stability Guarantees

- Error codes are stable
- Metadata evolves additively
- Messages change only in major versions

---

## 12. Summary

- Errors are domain-first
- The core protects invariants
- Adapters handle representation
- Contracts define capability boundaries
- Exceptions are the correct mechanism in the core
