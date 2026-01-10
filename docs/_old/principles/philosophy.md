# Comity Philosophy

**Status:** Authoritative  
**Version:** 1.0.0  
**Last updated:** 2026-01-08

---

Comity is not a framework. It is a **set of constraints** designed to make wrong code hard to write.

---

## 1. Core Principle

> **Comity optimizes for correctness, evolvability, and explicitness over convenience.**

Every design decision must answer:

1. Can this be reasoned about locally?
2. Can this evolve without cascading breakage?
3. Is the behavior explicit in types and contracts?

If the answer to any is "no", the design is rejected.

---

## 2. Layered Mental Model

Comity enforces strict dependency direction:

```
Adapters → Services → Core → Types
```

- **Types**: Pure data shapes, no behavior
- **Core**: Pure domain logic, side-effect free
- **Services**: Use case orchestration, IO boundaries
- **Adapters**: Framework-specific translations

Lower layers **never depend** on higher layers.

---

## 3. Core Is Sacred

The `core/` directory follows non-negotiable rules:

- No IO operations
- No global state
- No environment access
- No implicit time (`Date.now()`)
- No exceptions escaping

Core code must be:

- Deterministic
- Testable with plain objects
- Portable across runtimes

If a function needs IO, it is **not core**.

---

## 4. Explicit Invariants

Every domain defines invariants explicitly.

An invariant:

- Is a statement that must always hold true
- Is checked at boundaries
- Fails fast and explicitly

Example (Auth):

- A token is invalid if `iat > now`
- A session is invalid if `expiresAt <= now`

Invariants are centralized, named, and documented—never scattered.

---

## 5. Result-Driven Error Model

Comity does **not** use exceptions for control flow in domain logic.

All fallible operations return:

```typescript
Result<Value, Error>;
```

Where:

- `Value` is the success value
- `Error` is a **typed, structured error** (extends `BaseError`)

Errors are:

- Machine-readable (stable `code`)
- Contextual (`meta` field)
- Human-readable (short message)

Throwing is allowed **only** at adapter boundaries.

---

## 6. Errors Are Domain Objects

Errors are not strings or HTTP statuses.

Each domain defines:

- Error codes (e.g., `auth:token_expired`)
- Error shapes
- Error semantics

Errors:

- Never leak implementation details
- Never encode transport concerns
- Never assume HTTP context

Adapters translate domain errors → transport responses.

---

## 7. Time Is an External Input

Comity treats time as a dependency, not a global.

Rules:

- No `Date.now()` in core
- No implicit TTL calculations
- All time comparisons receive explicit `now: number`

Example:

```typescript
// Correct - Time is explicit parameter
function isExpired(expiresAt: number, now: number): boolean;

// Wrong - Implicit time access
function isExpired(expiresAt: number): boolean {
  return expiresAt < Date.now();
}
```

This enables deterministic testing and policy re-evaluation.

---

## 8. Policy As Data

Business rules are **configuration**, not hardcoded logic.

Examples:

- Token TTL
- Session sliding windows
- Authorization thresholds

Policies are:

- Explicit objects (not conditionals)
- Versionable
- Re-evaluatable at runtime

Changing a policy must not require rewriting logic.

---

## 9. Typed Domain Integrity

Primitive obsession is a design smell.

We do not pass `string` where `EmailAddress` is meant, nor `number` where `Percentage` is required.

Comity uses the type system to enforce domain invariants at boundaries:

```typescript
// Correct - Type encodes domain rule
interface EmailAddress {
  readonly value: string;
  readonly isValid: boolean;
}

// Wrong - String could be anything
function sendEmail(to: string): void;
```

Once data enters core, its type guarantees validity.

---

## 10. Minimal Public Surface

Every module exposes:

- A small, intentional API
- No internal helpers
- No leaky abstractions

If something is exported, it is:

- Stable across minor versions
- Documented with JSDoc
- Intended for external reuse

Everything else is marked `@internal`.

---

## 11. Predictability Over Magic

Comity rejects:

- Implicit behavior
- Reflection-heavy patterns
- "Smart" abstractions that hide complexity

Comity favors:

- Explicit wiring
- Factories over DI containers
- Plain functions over decorators
- Boring, obvious code over clever code

---

## 12. AI Alignment Rules

When generating or reviewing code for Comity:

**The AI must:**

- Preserve the dependency direction (Adapters → Core)
- Replace exception-based control flow with `Result` returns
- Enforce domain types over primitive types (`EmailAddress` not `string`)
- Ensure all external dependencies are explicitly injected
- Verify no IO operations exist in `core/`
- Pass time as explicit `now: number` parameter to time-dependent logic

**The AI must never:**

- Suggest global state, singletons, or service locators
- Use `any` type or generic `Error` class in domain logic
- Introduce framework types (Express, React) in business layers
- Hide logic behind "magic" decorators or auto-wiring
- Prioritize code brevity over explicit intent declaration

**If uncertain:** Choose the most explicit, restrictive, and testable implementation.

---

## 13. Design Smell Checklist

Stop and re-evaluate if you see:

- `any` type in `core/` directory
- Exceptions crossing architectural layers (except adapter boundaries)
- `Date.now()`, `Math.random()`, or environment access in business logic
- HTTP types (`Request`, `Response`) or database types in services/core
- Business logic failures thrown as exceptions
- Global/shared mutable state
- Primitive types (`string`, `number`) representing domain concepts
- Silent fallbacks with `||` operators
- Deep conditional nesting that could use `Result` chaining
- Business logic without corresponding deterministic tests
- Configuration values hardcoded in logic instead of policy objects

These are violations unless explicitly justified and documented.

---

## Final Statement

> **Comity is a system designed to make wrong code hard to write.**

If something feels verbose, that is intentional.
If something feels explicit, that is success.
If something feels constraining, that is protection.

**Correctness is a feature.**

---

## References

- [Architectural Rulebook](/docs/architecture/architectural-rulebook.md)
- [Error Model](/docs/architecture/error-model.md)
- [Result Model](/docs/architecture/result-model.md)
- [Anti-patterns](/docs/development/anti-patterns.md)
