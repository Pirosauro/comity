# Comity — Architecture Principles

This document defines the structural rules that guide Comity’s design decisions.

These are constraints, not suggestions.

---

1. Architecture Over Convenience

Every module must have:

- A clear responsibility
- A well-defined boundary
- A minimal public surface

Convenience is acceptable only if it does not compromise clarity or long-term stability.

---

2. Contracts First

All modules expose explicit contracts.

- Inputs are typed and validated.
- Outputs are predictable.
- Side effects are intentional.

Adapters normalize external systems to Comity contracts — never the opposite.

---

3. Stable Error Semantics

Errors must be:

- Typed
- Canonical
- Finite in classification
- Machine-readable

Application logic must rely on structured metadata — never on parsing error messages.

Messages are for diagnostics.
Metadata is for logic.

---

4. No Runtime Magic

Comity avoids:

- Hidden behavior
- Implicit dependency injection
- Global mutable state
- Automatic mutation of userland objects

If behavior exists, it must be visible in the code.

---

5. Enterprise-Grade by Default

Enterprise-grade means:

- Deterministic behavior
- Safe defaults
- Defensive programming
- Structured failure modes
- Clear extension points

It does not mean heavy configuration or layered abstraction.

---

6. Modularity as a Constraint

Modules must be:

- Independently replaceable
- Explicitly composable
- Free from cross-module leakage

If a module cannot be replaced without invasive changes, it is too coupled.

---

7. Observability is Structural

Critical boundaries must allow:

- Context propagation
- Duration measurement
- Failure classification

Observability must be possible without rewriting the module.

---

8. KISS — Without Naivety

APIs should be:

- Small
- Flat
- Learnable

But never at the expense of:

- Correctness
- Safety
- Architectural integrity

Simplicity is achieved through discipline, not reductionism.

---

9. Backward Stability Over Trend Adoption

API stability is a priority.

Breaking changes must be:

- Rare
- Justified
- Intentional
- Documented

Comity values long-term maintainability over short-term novelty.

---

10. Clear Boundary Between Framework and Application

Comity provides:

- Primitives
- Contracts
- Normalization layers

Applications provide:

- Business rules
- Policy decisions
- Integration choices

Comity does not enforce application architecture beyond its boundaries.

---

If a future design decision conflicts with these principles,
the conflict must be explicit and justified.

Architecture is preserved through discipline.
