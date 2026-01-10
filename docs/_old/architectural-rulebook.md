# Comity Architectural Rulebook

This document defines the architectural principles that govern the design of all Comity modules. These rules are intentionally few, strict, and non-negotiable. They exist to preserve long-term maintainability, composability, and correctness across the framework.

---

## 1. Core Is Pure

**The Core layer contains domain logic only.**

Rules:

- No framework dependencies
- No HTTP concepts
- No databases, ORMs, or drivers
- No side effects

Core expresses _what the system means_, not _how it is executed_.

If a piece of logic can be tested without mocks, it probably belongs in Core.

---

## 2. Ports Define Capabilities, Not Implementations

**Ports describe what the system needs, never how it is done.**

Rules:

- Ports are interfaces or function types
- Ports never import adapters
- Ports never encode infrastructure decisions

A port answers the question:

> “What capability does the domain require from the outside world?”

---

## 3. Adapters Translate, They Do Not Decide

**Adapters exist to translate external inputs into domain language, and domain outputs into external effects.**

Rules:

- Adapters may throw framework-specific errors
- Adapters may depend on external libraries
- Adapters must not contain business rules

If an adapter makes a decision, it is leaking domain logic.

---

## 4. Orchestrators Coordinate Use Cases

**Orchestrators belong to the Application layer.**

Rules:

- Orchestrators coordinate multiple ports and services
- They define execution order and error propagation
- They do not contain domain rules themselves

An orchestrator answers the question:

> “In what order do things happen to fulfill this use case?”

---

## 5. Services Expose Use Cases

**Services are stable entry points for the rest of the system.**

Rules:

- Services expose intention-revealing methods (e.g. `authorize`, `refresh`, `can`)
- Services are built from orchestrators or providers
- Services do not expose helpers or derived operations

If a method is a pure transformation of another method, it does not belong in a service.

---

## 6. Providers Evaluate, They Do Not Orchestrate

**Providers implement a single capability.**

Rules:

- Providers implement exactly one port
- Providers do not emit events
- Providers do not know application flow

Providers answer the question:

> “Given this input, what is the result?”

---

## 7. Events Observe, They Do Not Control

**Events are observational, never authoritative.**

Rules:

- Events are emitted after decisions are made
- No domain logic depends on events
- Removing an event must not change behavior

Events exist for monitoring, logging, analytics, and integration — not control flow.

---

## 8. Errors Are Layered

**Each layer owns its error semantics.**

Rules:

- Core errors are domain reasons (strings or enums)
- Application errors aggregate and propagate
- Adapters map errors to framework-specific exceptions

Errors must never leak infrastructure concerns inward.

---

## 9. Contracts Are Minimal

**Expose the smallest possible surface.**

Rules:

- Prefer one method over two
- Prefer data over behavior
- Prefer composition over inheritance

If an operation can be derived, expose a helper — not a new contract.

---

## 10. Naming Is Semantic

**Names must describe intent, not mechanics.**

Rules:

- Use verbs for use cases (`authorize`, `refresh`, `can`)
- Avoid technical prefixes in Core (`Http`, `Jwt`, `Sql`)
- Be explicit, even if verbose

A good name eliminates the need for comments.

---

## Final Principle

> **Architecture exists to make illegal states unrepresentable.**

If the architecture allows you to misuse a component easily, the architecture is wrong.

Comity favors clarity over cleverness, stability over flexibility, and correctness over convenience.
