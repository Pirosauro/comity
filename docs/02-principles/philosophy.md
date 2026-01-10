---
id: philosophy
status: authoritative
version: 1.0.0
owner: @architecture-council
enforcement: block
last_reviewed: 2026-01-08
next_review: 2027-01-08
supersedes: []
---

# Comity Philosophy

## Purpose

This document defines the **fundamental beliefs and principles** that guide every aspect of Comity. These principles are non-negotiable constraints that make wrong code hard to write and right code obvious.

Principles express _intent and direction_, not enforceable rules.
They are made binding only when implemented by Standards or Contracts.

Philosophy precedes implementation. Before writing code, understand why Comity exists and what problems it solves.

---

## Core Belief

> **Comity optimizes for correctness, evolvability, and explicitness over convenience.**

Every architectural decision, code review, and implementation choice must answer:

1. **Can this be reasoned about locally?**
2. **Can this evolve without cascading breakage?**
3. **Is the behavior explicit in types and contracts?**

If the answer to any is "no", the design should be rejected
and must be justified via ADR if adopted anyway.

---

## 1. Constraints Enable Freedom

Comity is not a framework of features, but a system of constraints. We believe:

- **Freedom emerges from limitations:** Clear boundaries enable creativity within them
- **Constraints prevent complexity:** By removing wrong options, we simplify decision-making
- **Discipline scales:** What feels restrictive individually enables collective velocity

We choose constraints that:

- Make common errors impossible
- Guide toward correct solutions
- Preserve flexibility where it matters

---

## 2. The Sacred Core

The `core/` directory contains pure domain logic only. It is:

### Foundational Constraints

These constraints express Comity's philosophy of purity.
They are enforced through Core Standards and CI/CD rules.

- **No IO:** No network, filesystem, or database operations
- **No global state:** No singletons, static variables, or shared mutable state
- **No environment access:** No `process.env`, configuration loading, or feature flags
- **No implicit time:** No `Date.now()` or `new Date()` - time is always an explicit parameter
- **No exceptions escaping:** Domain failures are values, not thrown exceptions

### Core Guarantees

- **Deterministic:** Same inputs → same outputs, always
- **Testable without mocks:** Requires only plain JavaScript objects
- **Portable:** Runs in Node.js, browsers, workers, anywhere
- **Framework-agnostic:** Knows nothing of Express, React, or HTTP

If a function needs IO, it is **not core**.

---

## 3. Layered Architecture with Direction

Dependencies flow in one direction only:

    Adapters → Services → Core → Types

### Layer Responsibilities

- **Types:** Pure data shapes, no behavior
- **Core:** Pure domain logic, business rules, policies
- **Services:** Use case orchestration, transaction boundaries, error aggregation
- **Adapters:** Framework integration, infrastructure communication, external system translation

### Architectural Integrity

- Lower layers never depend on higher layers
- Framework changes never ripple into business logic
- Database schema changes never require domain logic changes
- UI redesigns never affect authentication rules

This directionality is what makes evolution possible.

---

## 4. Errors Are Domain Objects

Errors are not strings, not exceptions, not HTTP status codes. They are **first-class domain data**.

### Error Properties

- **Typed:** Extend `BaseError` with domain-specific semantics
- **Structured:** Machine-readable `code`, human-readable `message`, contextual `meta`
- **Composable:** Can be combined, transformed, and matched
- **Serializable:** Safe for logging, API responses, and event streams

### Error Categories (Conceptual)

These categories are conceptual and guide reasoning.
Concrete enforcement and structure are defined in Error Handling Standards.

- **Domain errors:** Business rule violations (e.g., "insufficient permissions")
- **System errors:** Infrastructure failures (e.g., "database unavailable")
- **Validation errors:** Input constraints violated (e.g., "invalid email format")

Never use generic `Error` or string messages for domain failures.

---

## 5. The Result Pattern for Control Flow

Comity favors explicit result-based control flow over exceptions
for representing expected domain failures.

    type Result<T, E> =
      | { success: true; value: T; meta?: Record<string, unknown> }
      | { success: false; error: E };

Where `E extends BaseError`.

### Why Result Over Exceptions

- **Explicit:** Failure paths are visible in type signatures
- **Composable:** Results can be chained, mapped, and combined
- **Local:** No hidden control flow across stack frames
- **Type-safe:** The type system tracks success/failure states

Exceptions are for **programmer errors** (invalid arguments, unreachable code).  
Results are for **domain failures** (validation errors, business rule violations).

---

## 6. Time as an External Input

Time is not a global to be accessed, but a dependency to be provided.

### Core Principle

All time-dependent logic in Core receives `now: number` (Unix timestamp in milliseconds) as an explicit parameter.

### Correct Pattern

    function isTokenValid(token: Token, now: number): boolean {
      return token.expiresAt > now;
    }

### Incorrect Pattern

    function isTokenValid(token: Token): boolean {
      return token.expiresAt > Date.now(); // VIOLATION
    }

### Benefits

- **Deterministic tests:** Tests run the same regardless of when executed
- **Time travel:** Can evaluate policies at past or future times
- **Consistency:** Guarantees all time comparisons use the same reference point
- **Testability:** No need to mock global time functions

---

## 7. Policy as Data, Not Logic

Business rules are configuration, not code.

### Policy Objects

    const authPolicy = {
      tokenTtl: 3600,
      require2FA: true,
      maxSessions: 5,
      allowedAlgorithms: ["RS256", "ES256"]
    } as const;

### Benefits

- **Versionable:** Policies can be stored, compared, and rolled back
- **Evaluatable:** Can be validated, tested, and analyzed independently
- **Composable:** Multiple policies can be combined and prioritized
- **Observable:** Changes are explicit and trackable

Hardcoding business rules in logic creates hidden coupling. Expressing them as data enables evolution.

---

## 8. Typed Domain Integrity

The type system is our primary design tool. We use it to:

### Enforce Invariants

    type EmailAddress = string & { readonly __brand: "EmailAddress" };
    type Percentage = number & { readonly __brand: "Percentage"; readonly min: 0; readonly max: 100 };

### Model State

    type UserSession =
      | { status: "anonymous" }
      | { status: "authenticated"; userId: string; expiresAt: number }
      | { status: "expired"; userId: string };

### Guide Usage

    function sendEmail(to: EmailAddress, body: string): Promise<Result<void, EmailError>>;

The type system makes invalid states difficult or impossible to represent.

---

## 9. Minimal Public Surface

Every module exposes the smallest possible API that fulfills its purpose.

### Export Strategy

- **One responsibility per module:** Cohesive, focused interfaces
- **Hide internals:** Implementation details stay internal
- **Stable contracts:** Public APIs change only with major versions
- **Documented boundaries:** Clear what is supported, what is not

### Anti-Patterns

- ❌ "Utility" modules with unrelated functions
- ❌ Re-exporting third-party libraries without abstraction
- ❌ Exposing configuration interfaces that should be internal
- ❌ Providing multiple ways to accomplish the same thing

If something doesn't need to be public, it shouldn't be.

---

## 10. Predictability Over Magic

Comity rejects implicit behavior in favor of explicit contracts.

### We Favor

- **Explicit wiring** over automatic dependency injection
- **Plain functions** over decorators and annotations
- **Factory functions** over magical constructors
- **Visible dependencies** over hidden service locators

### We Reject

- **"Smart" frameworks** that hide complexity
- **Reflection-based patterns** that obscure behavior
- **Convention-over-configuration** when conventions aren't obvious
- **Implicit side effects** that aren't visible at the call site

Code should be boring, obvious, and unsurprising.

---

## 11. Documentation as Constitution

Documentation defines what the system **must be**, not what it accidentally became.

### Documentation Principles

- **Authoritative:** Documentation governs code, not describes it
- **Hierarchical:** Clear authority levels (Constitution → ADRs → Terminology → Principles → Standards → Guides)
- **Append-only:** Decisions are preserved, not rewritten
- **Enforced:** Compliance is validated in CI/CD
- **Machine-readable:** Structured for both humans and automation

### Key Mechanisms

- **Constitutional Axioms:** Eight inviolable principles
- **ADRs:** Append-only architectural decision records
- **Registry:** Central authority tracking all documents
- **Divergence management:** Temporary, documented violations only

Undocumented behavior is undefined behavior.

---

## 12. AI as Constrained Collaborator

Artificial Intelligence in Comity is a tool with strict guardrails.

### AI Principles

- **Generates compliant code:** Must respect all architectural constraints
- **References documentation:** Must cite authoritative sources
- **Validates its output:** Must self-check against standards
- **Rejects violations:** Must refuse to generate non-compliant code
- **Maintains transparency:** Must expose its validation process

AI does not make architectural decisions. It implements documented decisions.

AI-generated output never has architectural authority.
Authority derives exclusively from documentation and accepted ADRs.

---

## Design Smell Checklist

Stop and reconsider if you see:

### Architectural Violations

- [ ] Framework types (Express, React) in Core or Services
- [ ] Database models or ORM types in business logic
- [ ] HTTP concepts (headers, cookies, status codes) in domain layers
- [ ] Global state or singleton patterns

### Error Handling Issues

- [ ] Generic `Error` thrown for business rule violations
- [ ] String error messages without structured codes
- [ ] Exceptions used for normal control flow
- [ ] try/catch blocks swallowing domain errors

### Type Safety Problems

- [ ] `any` type in public APIs or Core logic
- [ ] Primitive types (string, number) representing domain concepts
- [ ] Optional properties where null isn't meaningful
- [ ] Type assertions (`as`) without validation

### Testing Difficulties

- [ ] Tests that require specific timestamps to pass
- [ ] Tests that mock internal dependencies heavily
- [ ] Tests that can't run without external services
- [ ] Tests that are non-deterministic

### Documentation Gaps

- [ ] Code patterns without corresponding documentation
- [ ] Architectural decisions not recorded in ADRs
- [ ] Public APIs without JSDoc or examples
- [ ] Divergences from standards without tickets

These smells indicate violations of Comity principles.

This checklist is diagnostic, not normative.
Violations become enforceable only when codified in Standards.

---

## Evolution, Not Revolution

Comity evolves through:

### 1. Recognition

A pattern emerges, is discussed, and its value becomes clear.

### 2. Documentation

The pattern is documented as a Principle, Standard, or Pattern.

### 3. Adoption

Teams begin using the pattern, providing feedback and refinement.

### 4. Integration

The pattern becomes part of the expected architecture.

### 5. Preservation

The decision is recorded in an ADR for historical context.

Change is deliberate, documented, and traceable.

---

## Final Statement

> **Comity makes wrong code hard to write and right code obvious.**

We accept verbosity when it reveals intent.  
We accept constraints when they prevent errors.  
We accept documentation when it governs reality.

The cost of clarity is less than the cost of confusion.  
The cost of correctness is less than the cost of bugs.  
The cost of discipline is less than the cost of chaos.

Comity is the art of building systems that remain comprehensible, maintainable, and correct—not just today, but in five years.

---

## References

- [Constitutional Axioms](/docs/00-constitution/constitutional-axioms.md)
- [Documentation Governance](/docs/00-constitution/documentation-governance.md)
- [Terminology](/docs/00-constitution/terminology.md)
- [ADR Process](/docs/00-constitution/adr-process.md)
- [AI Governance](/docs/02-principles/ai-principles.md)
