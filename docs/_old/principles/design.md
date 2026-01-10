# Design Philosophy

**Status:** Authoritative  
**Version:** 1.0.0  
**Last updated:** 2026-01-08

---

Design in Comity is the application of intentional constraints to guide developers toward correct solutions. It is how we implement philosophical principles in concrete structures.

---

## 1. Constraint Over Flexibility

Good design removes wrong options. We prefer systems that make incorrect usage impossible over systems that make all usage possible. Every design should have a "pit of success" where the obvious path is the correct one.

---

## 2. Consistency Over Novelty

Once a pattern is established, we apply it uniformly—even when a novel solution seems better for a specific case. Consistency enables predictability; predictability enables scale and reduces cognitive load.

New patterns are adopted only when they represent a fundamental improvement, not just variety.

---

## 3. Design for the Maintainer

We optimize for the person who must understand, debug, and extend the system months or years later. If a design choice makes writing easier but maintaining harder, it is wrong.

The maintainer's time is more valuable than the author's convenience.

---

## 4. Progressive Disclosure

Simple use cases should have simple interfaces; complex capabilities should require explicit opt-in. A design should not force all users to understand all complexity upfront.

Reveal power gradually, only when needed.

---

## 5. Testability as Requirement

If we cannot write clear, deterministic tests for a design, the design has failed. Testability is not an afterthought—it is a first-class design requirement that influences structure from the beginning.

---

## 6. Explicit Over Implicit

Hidden behavior is technical debt. We prefer designs where dependencies, side effects, and requirements are visible at the point of use. Magic is the enemy of maintainability.

---

## 7. AI Alignment Rules for Design

When designing any aspect of Comity:

**The AI must:**

- Apply existing patterns consistently before inventing new ones
- Prioritize the maintainer's understanding over authoring convenience
- Ensure testability is possible without complex mocking
- Make dependencies and side effects explicit in the design
- Verify the design guides users toward correct usage

**The AI must never:**

- Introduce hidden behavior or "magic" abstractions
- Sacrifice long-term maintainability for short-term elegance
- Create designs that require tribal knowledge to understand
- Violate established patterns without explicit justification

**If uncertain:** Choose the design that is most explicit, most testable, and most consistent with existing work.

---

## 8. Design Smell Checklist

These smells apply to ANY design in Comity:

- Requires extensive comments to explain basic usage
- Difficult to write deterministic tests for
- Contains hidden dependencies or side effects
- Forces users to understand internal implementation
- Inconsistent with similar patterns elsewhere in the codebase
- Optimized for the author's convenience over maintainer's clarity
- Uses "clever" techniques that obscure intent
- Cannot be understood by reading the public interface alone

These indicate fundamental design flaws, regardless of domain.

---

## Applying These Principles

These general principles manifest differently in each design domain:

### API Design

APIs apply these principles through: stable contracts, minimal surfaces, clear documentation.  
See: [API Design Principles](/docs/principles/design/api.md)

### Type Design

Types apply these principles through: compile-time guarantees, domain modeling, safety.  
See: [Type Design Principles](/docs/principles/design/type.md)

### Module Design

Modules apply these principles through: clear boundaries, single responsibility, dependency management.  
See: [Module Design Principles](/docs/principles/design/module.md)

---

## Final Statement

> **Good design in Comity is not measured by what it enables, but by what it prevents.**

We design constraints so that success becomes the default, and failure requires conscious effort.

---

## References

- [Core Philosophy](/docs/principles/philosophy.md)
- [API Design Principles](/docs/principles/design/api.md)
- [Type Design Principles](/docs/principles/design/type.md)
- [Module Design Principles](/docs/principles/design/module.md)
