---
id: design-philosophy
status: authoritative
version: 1.0.0
owner: @architecture-council
enforcement: block
last_reviewed: 2026-01-08
next_review: 2027-01-08
supersedes: []
---

# Comity Design Philosophy

## Purpose

This document translates the high-level [Comity Philosophy](/docs/02-principles/philosophy.md) into concrete, design-level guidance. It explains how philosophical principles manifest in everyday architectural and design choices **without introducing new enforceable rules**.

Design Philosophy bridges:

- **Principles** (why we believe)
- **Standards** (what we must do)

It provides **direction and rationale**, not enforcement. Normative requirements live exclusively in Standards (Level 3).

## Core Stance: Design for Change by Making Assumptions Explicit

In Comity, good design does not optimize for today's implementation, but for tomorrow's modification. Every design decision should make its assumptions visible, local, and replaceable.

A design is successful when:

- Its core assumptions are encoded in types or configuration
- Changes have a small, predictable blast radius
- Consequences are traceable and understandable

## 1. Explicit Over Implicit

Comity favors designs where behavior is obvious at the call site.

### Preferred Patterns

- Explicit parameters over ambient context
- Explicit dependencies (injected) over service locators or globals
- Explicit configuration objects over hidden defaults or environment variables
- Explicit data flow over inferred or implicit state changes

### Anti-Patterns

- Hidden global state or singleton registries
- Reflection-based wiring or metaprogramming that obscures dependencies
- Implicit side effects not indicated by function signatures
- Conventions that require prior tribal knowledge to understand

If a component's behavior cannot be understood by reading its public interface and function signatures, the design should be reconsidered.

## 2. Local Reasoning as a Primary Goal

A system should be understandable by examining a small, cohesive portion of it.

Designs should enable developers to:

- Understand a module's behavior without reading unrelated modules
- Reason about correctness without mentally simulating the entire system
- Modify one component without necessitating changes to many others

### Techniques Enabling Local Reasoning

- Small, pure, composable functions with clear contracts
- Explicit, typed inputs and outputs
- Narrow, focused interfaces (Interface Segregation Principle)
- Immutable data structures where appropriate

**Note:** Local reasoning is prioritized over strict DRY (Don't Repeat Yourself) when the two conflict. Clarity and independence trump deduplication.

## 3. Dependency Direction Shapes Architectural Integrity

Dependencies encode power and stability relationships. In Comity, dependencies must flow toward stable, high-value concepts.

### Stable Concepts (Depend Upon)

- Domain rules and business logic
- Core domain types and data shapes
- Business policies and invariants

### Volatile Concepts (Dependents)

- Frameworks (React, Express, etc.)
- Transport protocols (HTTP, gRPC, etc.)
- Database technologies and ORMs
- UI libraries and rendering concerns

Designs must ensure that volatile concepts depend on stable ones, **never the reverse**. This is achieved through:

- Ports and Adapters pattern
- Dependency Inversion Principle (DIP)
- Explicit boundaries and anti-corruption layers between architectural layers

## 4. Design for Replaceability

Every external dependency (library, service, framework) is treated as potentially replaceable.

A good design makes it clear:

- What would change if the dependency were replaced
- Where that change would be localized (ideally to a single Adapter)

### Signals of Replaceability

- Third-party libraries are wrapped by Adapters implementing domain-owned Ports
- Behavior is driven by configuration or policy objects, not hardcoded library calls
- Core business logic contains no direct imports of volatile libraries

If replacing a database driver or HTTP framework requires changes to Core domain logic, the design is flawed.

## 5. Data Shapes Drive Design

In Comity, data structures are designed before algorithms. The shape of data expresses intent and constraints.

### Philosophy

- Data shapes express and enforce domain invariants
- Algorithms operate on data that is already valid
- Invalid states should be unrepresentable in the type system

### Design Implications

- Prefer discriminated unions for modeling state machines
- Use branded or opaque types for domain primitives (e.g., `UserId`, `EmailAddress`)
- Avoid boolean flags that create implicit, undocumented states
- Leverage TypeScript's type system to make illegal states irrepresentable

Well-designed data reduces the need for defensive programming and runtime checks.

## 6. Composition Over Complex Configuration

Complex behavior should emerge from composing simple, well-defined units, not from vast, intricate configuration surfaces.

### We Favor

- Function composition and pipeline patterns
- Small, focused policy objects that can be combined
- Predictable, linear execution paths over nested conditional logic

### We Avoid

- Deeply nested configuration trees that control application logic
- Behavior determined by the interaction of many independent flags
- "Meta-frameworks" that generate logic from configuration, obscuring actual behavior

**Remember:** Configuration is data, not control flow.

## 7. Failure Is a First-Class Outcome

Designs must treat failure paths as equal citizens to success paths, not as afterthoughts or exceptions.

### Design Expectations

- Failure is represented explicitly in return types (e.g., `Result<T, E>`)
- Error information is structured, typed, and domain-specific
- Recovery and handling strategies are decisions for the caller, not the callee

Designs that hide failure behind thrown exceptions, generic logs, or silent defaults are discouraged.

## 8. Evolution Beats Prediction

Comity does not attempt to predict all future requirements. Instead, we design systems that can evolve cleanly.

### Evolvable Design Characteristics

- **Minimized Coupling:** Components interact through stable, narrow interfaces.
- **Isolated Assumptions:** Each component's assumptions about the world are explicit and contained.
- **Incremental Change:** The system can be improved piece by piece without massive rewrites.

Over-generalization ("designing for every possible future") is considered a design smell. Prefer designs that are simple today and can be extended tomorrow.

## 9. Boring Is a Feature

Comity values boring, obvious, and predictable designs over clever or novel ones.

### We Optimize For

- Readability and clarity over cleverness or brevity
- Explicitness and transparency over excessive abstraction
- Predictable, unsurprising behavior over "magic" or automation

If a design requires a lengthy explanation or a "trust me, it works" comment to be understood, it is likely too complex.

## 10. Documentation Is an Integral Part of the Design

A design that cannot be documented clearly and concisely is incomplete.

Design work is not finished until:

- Its core assumptions and constraints are documented
- Boundaries and interfaces with other components are explained
- Significant trade-offs and decisions are recorded (in an ADR if architecturally impactful)

Documentation is not an afterthought; it is a primary design artifact.

## Relationship to Other Documents

- **[Comity Philosophy](/docs/02-principles/philosophy.md):** Defines _why_ these principles exist and the core beliefs they stem from.
- **[Standards (Level 3)](/docs/03-standards/):** Define _how_ these principles are enforced via concrete, normative rules (`MUST`, `MUST NOT`).
- **[Architectural Decision Records (ADRs)](/docs/01-decisions/):** Explain _why_ a specific design choice was made in a historical, append-only record.
- **[Design Smells](/docs/02-principles/philosophy.md#design-smell-checklist):** For a checklist of specific design violations, consult the "Design Smell Checklist" section in the main Philosophy document.

This Design Philosophy document provides **guidance and rationale** when multiple technically compliant designs are possible. It helps teams choose the option that best aligns with Comity's long-term goals.

## Final Note

Good design makes the correct path obvious and the incorrect path uncomfortable. The Comity Design Philosophy exists to make architectural integrity, maintainability, and clarity the natural outcome of everyday development decisions.

## References

- [Comity Philosophy](/docs/02-principles/philosophy.md)
- [Constitutional Axioms](/docs/00-constitution/constitutional-axioms.md)
- [Documentation Governance](/docs/00-constitution/documentation-governance.md)
- [Terminology](/docs/00-constitution/terminology.md)
- [ADR Process](/docs/00-constitution/adr-process.md)
