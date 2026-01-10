---
id: constitutional-axioms
status: authoritative
version: 1.0.0
owner: @architecture-council
enforcement: block
last_reviewed: 2026-01-08
next_review: 2027-01-08
supersedes: []
---

# Constitutional Axioms of Comity Documentation

These axioms define the non-negotiable minimum of Comity's documentation system.
All policies, processes, tooling, and AI usage derive from them and cannot contradict them.

---

## Axiom 1 — Documentation Defines Intent

Documentation defines the intentional state of the system, not the accidental state.

- Code is correct only if it conforms to authoritative documentation
- Documentation may describe future states
- Retrospective documentation is permitted only when explicitly declared as such

---

## Axiom 2 — Explicit Authority Hierarchy

Every document has an explicit, deterministic position in an authority hierarchy.

- In case of conflict, the higher authority prevails
- No document exists outside the hierarchy
- Lack of classification equals lack of authority

---

## Axiom 3 — Single Authoritative Source

Every rule, constraint, or standard exists in exactly one authoritative source for its abstraction level.

- Explanations, examples, and patterns may be duplicated
- The normative rule may not
- Each category of rule (normative, procedural, terminological) has exactly one authoritative source

---

## Axiom 4 — No Silent Divergence

No divergence between code and documentation may exist without being:

- explicit
- documented
- traceable

Undocumented divergences are invalid.

---

## Axiom 5 — Temporary Divergence Must Have Sunset

Every authorized divergence is intrinsically temporary.

Each divergence must declare:

- an explicit expiration condition (date or event)
- a resolution condition

Divergences without expiration are null.

---

## Axiom 6 — Decisions Are Append-Only

Architectural decisions are historical.

- A decision is never rewritten
- Changes occur only through new decisions that:
  - declare what they supersede
  - explain why
- ADRs are the canonical form of architectural decisions

---

## Axiom 7 — Undefined Means Forbidden

What is not documented is not permitted.

- Permission is not inferred from:
  - existing implementations
  - observed behavior
  - implicit precedents
- AI must reject generation of undocumented patterns

---

## Axiom 8 — Enforcement Is Structural

Rules without enforcement are not rules.

- Every authoritative document declares:
  - enforcement level
  - ownership
- What is not enforceable cannot be Authoritative
- CI/CD validation is required for all authoritative rules

---

## Axiom 9 — Terminology Is Foundational

Shared language enables precise communication and prevents ambiguity.

- All terminology must be defined before use in authoritative documents
- Each term has exactly one canonical definition
- Domain-specific terms may extend but not contradict canonical definitions
- AI systems must use canonical terminology exclusively

---

### Axiom 10 — Quality Domain Declaration

Every Comity module MUST explicitly declare its Quality Domain.

The declared Quality Domain defines the scope, authority, and intensity of
governance applied to the module.

Constitutional governance MAY NOT be applied to any module
without an explicit Quality Domain declaration.

Implicit, inferred, or assumed Quality Domains are forbidden.

---

## Stability Notes

These axioms:

**Do not depend on:**

- tooling
- format
- AI capabilities
- filesystem structure
- specific programming languages

**Can survive:**

- team changes
- stack changes
- scale changes
- organizational changes

Any evolution of the documentation system:

- may change policies
- may change processes
- may change tooling

**But cannot violate these axioms.**

---

## Amendment Procedure

Changing these axioms requires:

1. **Proposal:** ADR with detailed rationale and impact analysis
2. **Review:** 30-day review period with all Architecture Council members
3. **Approval:** Unanimous vote of Architecture Council
4. **Implementation:**
   - Major version bump (X.0.0)
   - Update all dependent documents
   - Update AI training corpus
   - Migration period for existing code

Amendments are exceedingly rare and should preserve backward compatibility where possible.

---

## Recommended Preamble (Optional)

> In Comity, documentation is the constitution, not the commentary.
> We write documentation first and build reality to match it.
> When reality diverges, divergence must be explicit, temporary, and resolved.

---

## Constitutional Compact

By contributing to Comity, you agree that:

1. These axioms govern all documentation
2. Documentation defines what code should be, not what it is
3. Undocumented behavior is undefined behavior
4. Every divergence requires explicit, temporary authorization
5. Rules without enforcement are not binding
6. Shared terminology enables precise communication

This compact ensures that architecture in Comity is always intentional, never accidental.

---

## References

- [Documentation Governance](/docs/00-constitution/documentation-governance.md) - Implementation procedures
- [Terminology](/docs/00-constitution/terminology.md) - Canonical definitions
- [ADR Process](/docs/00-constitution/adr-process.md) - Decision recording
- [AI Governance](/docs/02-principles/ai-principles.md) - AI constraints

**Note:** These axioms are Level 0 - they cannot be superseded or overridden by any other document.
