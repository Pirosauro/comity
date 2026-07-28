# Architecture Review

## Scope

This review evaluates [AGENTS.md](../../../AGENTS.md), [README.md](../README.md), [SKILL.md](../SKILL.md), and [DESIGN.md](./DESIGN.md).

The goal of this review is to identify contradictions, missing decisions, boundary risks, dependency violations, and premature abstractions in the current design proposal.

This review does not propose implementation.

## Findings

### 1. Lifecycle ownership is aligned, but lifecycle semantics are still unresolved

- Category: Missing decision
- Severity: Important
- Why it matters: [README.md](../README.md) and [SKILL.md](../SKILL.md) include customer lifecycle, and [DESIGN.md](./DESIGN.md) also includes lifecycle in responsibilities. The remaining gap is not ownership, but semantics: lifecycle states and transitions are still open. Without that decision, use case contracts and error semantics may drift.
- Decision status: Requires decision before API design, because lifecycle states influence contract shape and validation logic.

### 2. Core Module dependency guidance is mostly aligned, but wording should avoid policy hardening by implication

- Category: Boundary risk
- Severity: Optional
- Why it matters: [AGENTS.md](../../../AGENTS.md) already states that Core Modules should avoid dependencies on other Core Modules unless explicitly justified. [DESIGN.md](./DESIGN.md) is directionally aligned, but should keep the same normative strength to avoid unintentionally turning guidance into a stricter local policy.
- Decision status: Can remain open, but wording should be normalized before final approval to prevent governance ambiguity.

### 3. The role of validation is still ambiguous between public API, module responsibility, and implementation detail

- Category: Missing decision
- Severity: Important
- Why it matters: [README.md](../README.md) lists `Validation contracts (if exposed)` in the public API, while [SKILL.md](../SKILL.md) defines validation as a module responsibility and [DESIGN.md](./DESIGN.md) keeps the public validation API explicitly open. This leaves uncertainty about whether validation contracts are a stable surface or an internal module concern.
- Decision status: Requires decision before API design, because it changes dependency policy, documentation expectations, and contract stability.

### 4. The boundary between customer use cases and application orchestration remains fragile

- Category: Boundary risk
- Severity: Important
- Why it matters: [AGENTS.md](../../../AGENTS.md) assigns business orchestration to the Application layer, while [README.md](../README.md) and [SKILL.md](../SKILL.md) place CRUD use cases inside the module. [DESIGN.md](./DESIGN.md) improves this by restricting use cases, but the design still leaves an interpretive gap around what counts as customer-domain orchestration versus application orchestration.
- Decision status: Requires decision before detailed API work, because this boundary determines whether the module stays a Core Module or starts absorbing Application responsibilities.

### 5. The design excludes `auth/session linkage`, but the customer/auth boundary is still unresolved

- Category: Boundary risk
- Severity: Important
- Why it matters: [README.md](../README.md) lists integration with `@comity/auth` as an intended extension point, while [DESIGN.md](./DESIGN.md) places `auth/session linkage` outside the module. That may be correct, but the distinction between customer identity and authenticated identity is still explicitly open in the same design. Excluding linkage before the identity boundary is decided risks freezing an integration boundary too early.
- Decision status: Requires decision, because identity ownership is a foundational domain boundary.

### 6. The design includes duplicated constraints in the use-case boundary section

- Category: Documentation quality
- Severity: Optional
- Why it matters: [DESIGN.md](./DESIGN.md) repeats equivalent constraints in the same list (`trigger external integrations` and `orchestrate workflows across bounded contexts` appear twice with near-identical wording). This is not an architecture defect, but it increases interpretation noise in an approval document.
- Decision status: Can remain open, but deduplication is recommended for clarity.

### 7. `Operations` is introduced as a design concept without support from the source documents

- Category: Premature abstraction
- Severity: Optional
- Why it matters: [DESIGN.md](./DESIGN.md) says the initial implementation may contain `operations`, while the source documents only speak about use cases, repositories, validation, and domain models. Introducing a second term next to `use cases` adds conceptual surface without explaining whether it is the same thing, a narrower concept, or a separate internal abstraction.
- Decision status: Can remain open, but the term should not become part of the approved design language unless it serves a clearly distinct architectural purpose.

### 8. `Extension points` are acknowledged before the extension boundary is defined

- Category: Premature abstraction
- Severity: Optional
- Why it matters: [SKILL.md](../SKILL.md) correctly says the module should grow through composition, and [DESIGN.md](./DESIGN.md) echoes that by saying the module may expose extension points. However, the design also states that extension mechanisms are intentionally undefined. That means the design currently names an abstraction class before it identifies the actual seam that needs to remain stable.
- Decision status: Can remain open, because the design does not force a mechanism yet, but it should not be treated as an approved public abstraction until a concrete extension boundary is identified.

### 9. Some domain decisions required by the declared use cases and errors are still missing from the open questions

- Category: Missing decision
- Severity: Important
- Why it matters: the design already lists `DeleteCustomer`, `SearchCustomers`, and errors such as `DuplicateCustomer`, but [DESIGN.md](./DESIGN.md) does not explicitly call out decision points such as delete semantics, duplicate criteria, and the minimum search capability that the repository contract must support. These are not implementation details; they shape the public contract and error model.
- Decision status: Requires decision before contract design, because the module cannot define stable repository abstractions without these domain rules.

### 10. The design does not yet state whether the customer aggregate may reference identifiers owned by other modules

- Category: Boundary risk
- Severity: Important
- Why it matters: [AGENTS.md](../../../AGENTS.md) emphasizes strict boundaries and replaceable modules, while [README.md](../README.md) names future integrations with `@comity/auth`, `@comity/media`, CRM, and ERP systems. Without an explicit rule here, the customer aggregate may later absorb foreign identifiers or integration-specific fields, which would couple a Core Module to external bounded contexts.
- Decision status: Requires decision before model and contract design, because this directly affects aggregate purity and long-term replaceability.
