# Comity Result Model

**Status:** Authoritative
**Version:** 1.0
**Last updated:** 2026-01-08

---

## Purpose

The Comity Result Model defines the **official, framework-level contract** for representing _expected outcomes_ of domain and application logic without relying on exceptions.

It is designed to:

- complement (not replace) the Error Model
- enable explicit, typed success/failure flows
- avoid string-based or ad-hoc result shapes
- support domain-specific semantics (e.g. `allow`, `authorized`) without fragmenting the framework

---

## Scope and placement

- **Package:** `@comity/core`
- **Module:** `result`
- **Nature:** contract-only (types), no runtime logic

The Result Model is intended for:

- domain logic
- application services
- policy evaluation (ACL, auth, rules engines)

It is **not mandatory** for system primitives (Container, EventBus, Kernel), which may throw errors.

---

## Design principles

1. **Explicit outcomes**
   Success and failure are modeled explicitly and exhaustively.

2. **Error consistency**
   Failures always carry a `BaseError` (never strings).

3. **Semantic flexibility**
   Domains may choose their own discriminator (`ok`, `allow`, `authorized`, …).

4. **Structural safety**
   Reserved keys (`value`, `error`, `meta`) cannot be misused as discriminators.

5. **No transport coupling**
   Result is independent from HTTP, CLI, or UI concerns.

---

## Official Result Contract

```ts
import type { BaseError } from "../errors/base.js";

export type ResultSuccess<Value, Discriminator extends string = "success"> = {
  readonly value: Value;
  readonly meta?: Record<string, unknown>;
} & { readonly [K in Discriminator]: true };

export type ResultFailure<
  E extends BaseError = BaseError,
  Discriminator extends string = "success"
> = {
  readonly error: E;
} & { readonly [K in Discriminator]: false };

type PreventReservedDiscriminator<K extends string> = K extends "value"
  ? {
      _error: "Cannot use 'value' as discriminator. It's used for the success value.";
    }
  : K extends "error"
  ? {
      _error: "Cannot use 'error' as discriminator. It's used for the failure error.";
    }
  : K extends "meta"
  ? { _error: "Cannot use 'meta' as discriminator. It's used for metadata." }
  : K;

export type Result<
  Value,
  Error extends BaseError = BaseError,
  Discriminator extends string = "success"
> = PreventReservedDiscriminator<Discriminator> extends infer CheckedDiscriminator
  ? CheckedDiscriminator extends string
    ? ResultSuccess<Value, Discriminator> | ResultFailure<Error, Discriminator>
    : CheckedDiscriminator
  : never;
```

---

## Default usage (`success` discriminator)

```ts
function loadUser(id: string): Result<User> {
  const user = repo.find(id);

  if (!user) {
    return {
      ok: false,
      error: new NotFoundError("User not found", { id }),
    };
  }

  return {
    ok: true,
    value: user,
  };
}
```

---

## Domain-specific discriminator example (ACL)

```ts
type AccessResult = ResultContract<PolicyDecision, ForbiddenError, "allow">;

return {
  allow: false,
  error: new ForbiddenError("Access denied", {
    policy: "admin-only",
  }),
};
```

This avoids semantic overload of `ok` while preserving a unified structure.

---

## What Result MUST NOT be

- ❌ a replacement for `throw` at system boundaries
- ❌ a container for string reasons
- ❌ a transport-level abstraction
- ❌ partially typed (`any`, unions of unrelated shapes)

---

## Relationship to the Error Model

- `Result` **contains** `BaseError`
- Errors remain the single source of truth for failure identity
- Result controls _flow_, Error controls _meaning_

They are complementary by design.

---

## Stability guarantees

- Result shape is stable across minor versions
- Reserved keys will not change
- Additional optional fields may be added only in major versions

---

## Summary

- Result is an **official Comity contract**
- It is flexible, safe, and domain-friendly
- Errors remain first-class citizens
- Control flow is explicit and testable

This model enables consistent, expressive domain logic without sacrificing architectural rigor.
