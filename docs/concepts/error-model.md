# Error Model

Comity adopts a **domain-first error model**.

Errors are treated as **explicit, structured data**, not as control flow shortcuts and not as HTTP responses by default.
They are designed to be:

- predictable
- composable
- environment-agnostic
- safe to expose across layers

---

## Core principles

### 1. Errors represent conditions, not transports

An error represents a **domain or system condition**.

It may later be _adapted_ to:

- an HTTP response
- a CLI exit code
- a UI message
- a log entry

But the error itself is **not HTTP-first**.

---

### 2. Error identity is stable

Each error has a stable, machine-readable `code`.

```ts
error.code === "NOT_FOUND";
```

This code:

- does not change over time
- is safe to branch on
- is independent from message wording

---

### 3. Messages are human-readable, not programmatic

Error messages:

- are short
- are stable
- do not contain interpolated values

Dynamic information must be carried via metadata.

```ts
throw new NotFoundError("Service not registered", {
  service: "database",
});
```

---

### 4. Metadata carries context

Errors can include arbitrary metadata to provide context without affecting the message.

Typical metadata includes:

- identifiers
- configuration values
- domain-specific details

Metadata is:

- structured
- optional
- safe to serialize

---

### 5. HTTP status codes are optional adapters

Errors may include an `httpStatus` **as metadata**, but this is never mandatory.

```ts
{
  httpStatus: 404;
}
```

This allows:

- reuse of the same error in non-HTTP environments
- late binding to transport-specific representations

---

## BaseError

All framework errors extend `BaseError`.

```ts
export abstract class BaseError extends Error {
  readonly code: string;
  readonly meta: Record<string, unknown>;
}
```

### Guarantees

- `code` is always present
- `meta` is always defined
- `cause` is preserved via native `Error` chaining
- `name` matches the concrete class name

---

## Error categories

Comity distinguishes errors by **intent**, not by layer.

### Domain errors

Represent expected business conditions.

Examples:

- resource not found
- invalid state
- conflict

These errors are:

- expected
- actionable
- safe to expose

---

### System errors

Represent failures of the system or environment.

Examples:

- cryptographic failure
- corrupted data
- unexpected invariants

These errors are:

- not expected
- usually not recoverable
- wrapped to preserve the original cause

---

## Common errors

### NotFoundError

Used when a required resource or entity does not exist.

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
throw new ValidationError("Invalid module metadata", {
  field: "dependsOn",
});
```

---

### UnexpectedError

Used as a **safe boundary** for failures that should not happen.

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

This error:

- preserves the original cause
- avoids leaking implementation details
- signals a non-domain failure

---

### ServiceUnavailableError

Used when a dependency or subsystem is temporarily unavailable.

```ts
throw new ServiceUnavailableError("Service unavailable", {
  retryAfter: 30,
});
```

---

## Error propagation

Errors should generally be allowed to propagate until they reach:

- a framework boundary
- an adapter (HTTP, CLI, worker)

Do **not**:

- swallow errors
- rethrow generic `Error`
- mutate existing errors

---

## Mapping errors to transports

Adapters are responsible for mapping errors to transport-specific representations.

Example (HTTP):

```ts
switch (error.code) {
  case 'NOT_FOUND':
    return res.status(404).json(...)
  case 'VALIDATION_ERROR':
    return res.status(400).json(...)
}
```

The core never performs this mapping.

---

## What this model avoids

- HTTP-coupled exceptions
- string-based error matching
- inconsistent messages
- environment-specific assumptions

---

## Stability guarantees

- Error `code` values are stable across minor versions
- Metadata shape may evolve additively
- Messages may change only in major versions

---

## Summary

- Errors are domain-first
- Metadata carries context
- HTTP is an adapter, not a dependency
- Stability and predictability are prioritized

This model enables safe reuse of the framework across APIs, SaaS applications, workers, and CLIs.
