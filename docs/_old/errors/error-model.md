# Comity Error Model

**Status:** Authoritative
**Version:** 1.0.0
**Last updated:** 2026-01-08

---

## Purpose

This document defines the **authoritative error model** for the Comity framework.

Errors in Comity are:

- domain-first
- structured
- transport-agnostic
- safe to propagate across layers

This document supersedes any previous or partial descriptions of error handling.

---

## Core principles

### 1. Errors represent conditions, not transports

Errors model **domain or system conditions**.
They are not HTTP responses, CLI exit codes, or UI messages.

Transport-specific representations are handled by adapters.

---

### 2. Error identity is stable

Each error exposes a stable, machine-readable `code`.

```ts
error.code === "core:NOT_FOUND";
```

Rules:

- codes do not change over time
- codes are safe to branch on
- codes are independent from message wording

**Format:**

```
<namespace>:<CODE>
```

Examples:

- `core:NOT_FOUND`
- `core:VALIDATION_ERROR`

---

### 3. Messages are human-readable, not programmatic

Error messages:

- are short
- are stable
- contain no interpolated values

Dynamic or contextual information must be carried via metadata.

```ts
throw new NotFoundError("Resource not found", {
  resource: "user",
  id: userId,
});
```

---

### 4. Metadata carries context

Metadata:

- is structured
- is optional
- is safe to serialize

Typical uses:

- identifiers
- configuration values
- domain details

---

### 5. HTTP status is adapter-level

Errors may include `httpStatus` **as metadata**, but never as a requirement.

```ts
{
  httpStatus: 404;
}
```

The core never maps errors to transports.

---

## BaseError

**Location:** `@comity/core/errors/base.ts`

`BaseError` is the **only official base class** for framework errors.

```ts
export abstract class BaseError extends Error {
  abstract readonly code: string;
  readonly meta: Record<string, unknown>;
}
```

Guarantees:

- `code` is always present
- `meta` is always defined
- `cause` is preserved
- `name` matches the concrete class

---

## Error categories

### Domain errors

Represent expected, actionable conditions.
Safe to expose.

Examples:

- not found
- validation failed
- conflict

---

### System errors

Represent unexpected or infrastructural failures.

Examples:

- corrupted data
- invariant violations
- unavailable dependencies

---

## Core error catalog

### BadRequestError

Used when a request is syntactically invalid.

```ts
throw new BadRequestError("Bad request");
```

Code: `core:BAD_REQUEST`

---

### UnauthorizedError

Used when authentication is required or invalid.

Code: `core:UNAUTHORIZED`

---

### ForbiddenError

Used when access is denied.

Code: `core:FORBIDDEN`

---

### NotFoundError

Used when a required resource does not exist.

Code: `core:NOT_FOUND`

---

### ConflictError

Used when an operation conflicts with existing state.

Code: `core:CONFLICT`

---

### ValidationError

Used when input or configuration is invalid.

Code: `core:VALIDATION_ERROR`

---

### UnprocessableEntityError

Used when input is well-formed but semantically invalid.

Code: `core:UNPROCESSABLE_ENTITY`

---

### TooManyRequestsError

Used when rate limits are exceeded.

Code: `core:TOO_MANY_REQUESTS`

---

### ServiceUnavailableError

Used when a dependency or subsystem is temporarily unavailable.

```ts
throw new ServiceUnavailableError("Service unavailable", {
  retryAfter: 30,
});
```

Code: `core:SERVICE_UNAVAILABLE`

---

### InternalError

Used as a safe boundary for failures that should not happen.

Code: `core:INTERNAL_ERROR`

---

## Adapter rules

- Adapters **must not mutate existing errors**
- Adapters may **create new errors** if necessary
- Mapping to HTTP / CLI / UI happens exclusively in adapters

---

## Stability guarantees

- Error codes are stable across minor versions
- Metadata may evolve additively
- Messages may change only in major versions
