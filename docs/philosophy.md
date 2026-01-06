# Comity Philosophy

This document defines the **philosophical foundations of Comity**.
It is intended for:

- New developers joining the project
- AI-assisted development (to minimize hallucinations)
- Architectural consistency across the monorepo

Comity is **not a framework**. It is a **set of constraints**.

---

## 1. Core Principle

> **Comity optimizes for correctness, evolvability, and explicitness over convenience.**

Every design decision must answer three questions:

1. Can this be reasoned about locally?
2. Can this evolve without cascading breakage?
3. Is the behavior explicit in types and contracts?

If the answer to any is "no", the design is rejected.

---

## 2. Layered Mental Model

Comity enforces a strict dependency direction:

```
Adapters → Services → Core → Types
```

- **Types**: pure data, no behavior
- **Core**: pure domain logic, deterministic, side-effect free
- **Services**: orchestration, IO boundaries
- **Adapters**: transport-specific glue (HTTP, Workers, RPC)

Lower layers **never depend** on higher layers.

---

## 3. Core Is Sacred

The `core/` directory follows non-negotiable rules:

- No IO
- No global state
- No environment access
- No clocks (time is passed in)
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

Invariants are:

- Centralized
- Named
- Documented

Never scatter implicit assumptions.

---

## 5. Result-Driven Error Model

Comity does **not** use exceptions for control flow.

All fallible operations return:

```
Result<T, E>
```

Where:

- `T` is the success value
- `E` is a **typed, structured error**

Errors are:

- Machine-readable (code)
- Contextual (meta)
- Human-readable (short message)

Throwing is allowed **only** at adapter boundaries.

---

## 6. Errors Are Domain Objects

Errors are not strings.

Each domain defines:

- Error codes
- Error shapes
- Error semantics

Errors:

- Never leak internal details
- Never encode transport concerns
- Never assume HTTP

Adapters translate errors → responses.

---

## 7. Time Is a Dependency

Comity treats time as an external input.

Rules:

- No `Date.now()` in core
- No implicit TTLs
- All time comparisons receive `now`

This enables:

- Deterministic tests
- Time travel
- Policy re-evaluation

---

## 8. Policy Is Data

Business rules are **configuration**, not logic.

Examples:

- Token TTL
- Session sliding window
- Step-up thresholds

Policies:

- Are explicit objects
- Are versionable
- Can be re-evaluated

Changing a policy must not require rewriting logic.

---

## 9. Minimal Public Surface

Every module exposes:

- A small, intentional API
- No internal helpers
- No leaky abstractions

If something is exported, it is:

- Stable
- Documented
- Intended for reuse

Everything else is internal.

---

## 10. Predictability Over Magic

Comity rejects:

- Implicit behavior
- Reflection-heavy patterns
- "Smart" abstractions

Favor:

- Explicit wiring
- Factories over DI containers
- Plain functions over decorators

Code should be boring and obvious.

---

## 11. AI Alignment Rules

When generating or reviewing code for Comity:

The AI must:

- Preserve dependency direction
- Avoid hidden side effects
- Respect result-based errors
- Keep core pure
- Encode invariants explicitly

The AI must **never**:

- Introduce middleware in core
- Throw domain errors directly
- Hide logic behind frameworks
- Guess missing requirements

If uncertain, the AI must ask or return a partial solution.

---

## 12. Design Smell Checklist

Stop and re-evaluate if you see:

- `any` in core
- Exceptions crossing layers
- Middleware doing business logic
- Time accessed implicitly
- Config hardcoded in logic

These are violations unless explicitly justified.

---

## Final Statement

> Comity is a system designed to make **wrong code hard to write**.

If something feels verbose, that is intentional.
If something feels explicit, that is success.

Correctness is a feature.
