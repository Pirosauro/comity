You are acting as a software architect.

Your task is to create a DESIGN.md proposal.

Rules:

- Do not invent missing domain decisions.
- When information is missing, stop and ask questions.
- Never create implementation details before design approval.
- Prefer explicit unknowns over assumptions.

Read:

- `/Users/filippo/Projects/comity/AGENTS.md`
- `/Users/filippo/Projects/comity/packages/customer/README.md`
- `/Users/filippo/Projects/comity/packages/customer/SKILL.md`

Create: `/Users/filippo/Projects/comity/packages/customer/docs/DESIGN.md`

Sections:

# Purpose

# Responsibilities

# Non Goals

# Dependencies

# Domain Concepts

# Open Questions

# Proposed Architecture

# Alternatives Considered

---

Review `/Users/filippo/Projects/comity/packages/customer/docs/DESIGN.md`

Act as an architecture reviewer.

Find:

- invented assumptions
- wrong dependencies
- boundary violations
- missing decisions
- unnecessary abstractions

Do not rewrite.
Only provide review comments.

---

Using:

- `/Users/filippo/Projects/comity/AGENTS.md`
- `/Users/filippo/Projects/comity/packages/customer/README.md`
- `/Users/filippo/Projects/comity/packages/customer/SKILL.md`
- `/Users/filippo/Projects/comity/packages/customer/docs/DESIGN.md`

Create an architecture review.

Rules:

- Do not propose implementation.
- Do not invent missing domain decisions.
- Identify:
  - contradictions
  - missing decisions
  - boundary risks
  - dependency violations
  - premature abstractions

For every issue:

- explain why it matters
- mark severity:
  Critical / Important / Optional
- suggest whether it requires a decision or can remain open.

Write output to:
`/Users/filippo/Projects/comity/packages/customer/docs/ARCHITECTURE-REVIEW.md`

---

Based exclusively on:

- `/Users/filippo/Projects/comity/AGENTS.md`
- `/Users/filippo/Projects/comity/packages/customer/README.md`
- `/Users/filippo/Projects/comity/packages/customer/SKILL.md`
- `/Users/filippo/Projects/comity/packages/customer/docs/DESIGN.md`
- packages/customer/docs/ARCHITECTURE-REVIEW.md

Design the PUBLIC API of @comity/customer.

Create `/Users/filippo/Projects/comity/packages/customer/docs/API.md`

Requirements:

- Do not discuss implementation.
- Do not propose folder structures.
- Do not propose filenames.
- Do not write TypeScript code.
- Do not discuss testing.
- Do not discuss adapters.
- Do not discuss dependency injection.

Focus only on the public contract.

The document should define:

- public concepts
- public models
- aggregate boundaries
- repository contracts
- repository responsibilities
- use case responsibilities
- domain errors
- value objects
- identifiers
- invariants
- validation responsibilities
- events (only if required)
- public exports
- unresolved API questions

If information is missing, stop and ask questions instead of inventing APIs.

Do not assume anything that is not documented.

This document is an API proposal, not an implementation proposal.

---

Review `/Users/filippo/Projects/comity/packages/customer/docs/API.md`

Use only:

- `/Users/filippo/Projects/comity/AGENTS.md`
- `/Users/filippo/Projects/comity/packages/customer/README.md`
- `/Users/filippo/Projects/comity/packages/customer/SKILL.md`
- `/Users/filippo/Projects/comity/packages/customer/docs/DESIGN.md`
- `/Users/filippo/Projects/comity/packages/customer/docs/ARCHITECTURE-REVIEW.md`

Your goal is to review the API proposal.

Do not redesign it.

Identify only:

- contradictions
- invented assumptions
- missing API decisions
- dependency violations
- boundary violations
- leaked implementation details
- unnecessary abstractions
- public API inconsistencies
- aggregate inconsistencies
- naming inconsistencies

For every finding include:

- category
- severity
- affected section
- rationale
- recommendation

Do not suggest implementation.

Do not invent new requirements.

Reference the exact section names from the reviewed documents.

---

Update `/Users/filippo/Projects/comity/packages/customer/docs/API.md` based on `/Users/filippo/Projects/comity/packages/customer/docs/API-REVIEW.md` findings.

Rules:

- Modify only API.md.
- Do not change DESIGN.md, SKILL.md, README.md or ARCHITECTURE-REVIEW.md.
- Do not introduce new domain decisions.
- Do not invent missing requirements.
- Preserve all decisions already approved.

Apply only valid corrections from the review:

- restore Customer Lifecycle as a domain concept with deferred states
- keep validation ownership open
- remove premature repository signature decisions
- avoid leaking persistence semantics into the API
- clarify unresolved questions

If a review finding conflicts with existing architectural decisions, stop and ask.

---

Create docs/PACKAGE-DESIGN.md for @comity/customer.

Use as source of truth:

- ../../../AGENTS.md
- ../README.md
- ../SKILL.md
- ./DESIGN.md
- ./API.md

This document must describe the internal package architecture.

Important constraints:

- Do not invent new domain concepts.
- Do not change public API decisions.
- Do not resolve open questions from API.md.
- Do not introduce abstractions without justification.
- The folder structure is an implementation proposal, not a public contract.

The document should define:

1. Package role

- Core Module responsibilities
- Dependency boundaries

2. Internal architecture

- Recommended source folders
- Responsibility of each folder
- Public vs internal files

3. Domain organization

- Where Customer aggregate lives
- Where value objects live
- Where domain errors live

4. Repository organization

- Repository contracts
- Persistence adapter boundary

5. Use case organization

- Scope of customer use cases
- Explicit limitations

6. Validation organization

- Keep validation strategy aligned with API.md
- Do not assume Zod as public API

7. Export strategy

- What belongs in index.ts
- What remains internal

8. Testing organization

- Unit tests
- Domain tests
- Contract tests

9. Open implementation decisions

If information is missing, stop and ask questions instead of inventing structure.

---

# Package Design Review

## Scope

This review evaluates `/Users/filippo/Projects/comity/packages/customer/docs/PACKAGE-DESIGN.md` exclusively against:

- `/Users/filippo/Projects/comity/AGENTS.md`
- `/Users/filippo/Projects/comity/packages/customer/README.md`
- `/Users/filippo/Projects/comity/packages/customer/SKILL.md`
- `/Users/filippo/Projects/comity/packages/customer/docs/DESIGN.md`
- `/Users/filippo/Projects/comity/packages/customer/docs/API.md`
- `/Users/filippo/Projects/comity/packages/customer/docs/ARCHITECTURE-REVIEW.md`

The goal is to identify:

- contradictions with approved architecture and domain decisions
- dependency boundary violations
- public API/export inconsistencies
- premature implementation commitments
- folder structure decisions that accidentally become architectural contracts
- missing implementation decisions that block package organization

This review must not propose implementation details unless required to explain a contradiction.

The PACKAGE-DESIGN.md is an implementation organization proposal.
It must not redefine:

- public API contracts
- domain ownership
- dependency rules
- unresolved design decisions

---

## Review Rules

For each finding include:

- Category
- Severity
- Exact affected section in PACKAGE-DESIGN.md
- Reference document and section causing the conflict
- Why it matters
- Recommendation

Categories:

- Contradiction
- Missing decision
- Boundary risk
- Dependency violation risk
- Premature abstraction
- Documentation inconsistency

Do not report style preferences unless they create architectural ambiguity.

---

## Specific Checks

### 1. Layering compliance

Verify that the proposed package structure respects:

- Core Module boundaries
- allowed dependencies:
  - @comity/primitives
  - @comity/kernel only when justified
- no adapters
- no applications
- no other Core Modules unless approved

Check that no internal folder creates forbidden coupling.

---

### 2. Public API alignment

Verify that:

- exported files match API.md
- internal implementation details are not accidentally promoted
- validation remains consistent with the unresolved validation decision
- repository contracts remain aligned with API.md

---

### 3. Domain ownership

Verify that:

- Customer aggregate ownership is preserved
- lifecycle is represented consistently with DESIGN.md/API.md
- Contact Information / Contact / Addresses / Address terminology remains coherent
- domain errors remain inside the module boundary

---

### 4. Repository and use case organization

Verify that PACKAGE-DESIGN.md does not accidentally decide unresolved API questions:

- create vs update persistence semantics
- repository method names
- search criteria shape
- delete semantics
- not-found representation

The package structure may describe relationships but must not freeze contracts.

---

### 5. Validation boundary

Verify that:

- validation ownership remains with customer module
- Zod or any validation library is not leaked as public architecture
- validation folder decisions do not create a public contract accidentally

---

### 6. Testing strategy

Verify that testing descriptions:

- validate architecture contracts
- do not introduce unsupported domain assumptions
- do not define behavior not approved in DESIGN.md/API.md

---

### 7. Implementation commitment risk

Identify whether any proposed folder, file, naming convention, or internal abstraction:

- is unnecessarily treated as stable architecture
- should remain an implementation choice

---

## Final Assessment

Provide:

- overall consistency status
- blocking issues before implementation
- non-blocking improvements
- whether PACKAGE-DESIGN.md is ready to become the implementation guide

Do not rewrite PACKAGE-DESIGN.md.

---

# Implementation Plan Review Preparation

You are preparing the implementation plan for @comity/customer.

Before writing implementation details, read and respect these sources of truth:

`/Users/filippo/Projects/comity/AGENTS.md`
`/Users/filippo/Projects/comity/packages/customer/docs/API-REVIEW-V2.md` `/Users/filippo/Projects/comity/packages/customer/docs/API-REVIEW.md` `/Users/filippo/Projects/comity/packages/customer/docs/API.md` `/Users/filippo/Projects/comity/packages/customer/docs/ARCHITECTURE-REVIEW.md` `/Users/filippo/Projects/comity/packages/customer/docs/DESIGN.md` `/Users/filippo/Projects/comity/packages/customer/docs/PACKAGE-DESIGN-REVIEW.md` `/Users/filippo/Projects/comity/packages/customer/docs/PACKAGE-DESIGN.md`

## Goal

Create IMPLEMENTATION-PLAN.md.

This document is an execution plan, not a new architecture document.

It must describe the implementation order, dependencies between implementation steps, and verification strategy.

Do not redesign the module.
Do not introduce new public API decisions.
Do not resolve open domain decisions.

## Rules

The implementation plan MUST:

- follow the approved PACKAGE-DESIGN.md structure
- implement only the public contract defined in API.md
- preserve all deferred decisions
- avoid introducing abstractions not required by existing documents
- distinguish implementation tasks from architecture decisions

If information is missing:

- do not invent a solution
- mark it as "blocked by domain decision" or "deferred"

## Required Sections

Create:

# Implementation Plan

## 1. Implementation Principles

Explain:

- Core Module constraints
- dependency restrictions
- public API stability
- no infrastructure coupling

## 2. Implementation Order

Define the recommended sequence.

Expected areas:

1. Package setup
2. Domain foundation
   - CustomerId
   - Customer aggregate
   - value objects
   - domain errors

3. Repository contract

4. Use cases

5. Validation implementation

6. Public exports

7. Tests

8. Documentation synchronization

The order must explain dependencies between steps.

## 3. Domain Implementation

Describe implementation work for:

- Customer aggregate
- Profile
- Contact
- Address
- Preferences
- lifecycle concept with deferred states

Do not invent lifecycle states.

## 4. Repository Implementation

Describe:

- CustomerRepository contract implementation work
- adapter boundary expectations
- Result handling

Do not define:

- create/update method names
- persistence strategy
- SQL models
- ORM mapping

Those are deferred.

## 5. Use Case Implementation

Describe implementation of:

- CreateCustomer
- UpdateCustomer
- DeleteCustomer
- GetCustomer
- SearchCustomers

Respect:

- use cases orchestrate domain operations
- use cases depend on repository contracts
- no application workflows
- no external integrations

## 6. Validation Implementation

Describe validation implementation constraints:

- owned by customer module
- no public validation API decision yet
- no mandatory validator library
- no leakage into public exports

Do not decide Zod vs another validator.

## 7. Testing Strategy

Define:

- domain tests
- value object tests
- aggregate invariant tests
- repository contract tests
- use case tests

Reference API.md as source of domain invariants.

Do not create new business rules.

## 8. Implementation Milestones

Define milestones such as:

- Domain foundation complete
- Repository contracts complete
- Use cases complete
- Public API complete
- Test coverage complete

Each milestone should have acceptance criteria.

## 9. Deferred Decisions

List decisions that must remain open:

- lifecycle states
- delete semantics
- repository persistence semantics
- search criteria
- validation public API
- auth/customer relationship

Explain that these should become explicit decisions or ADRs when implementation reaches them.

## Final Requirement

The output must be an implementation roadmap for engineers.

It must answer:

"What should we implement first, second, and third?"

It must not answer:

"What should the architecture become?"

Architecture is already approved.

---

# Implementation Task

Implement `@comity/customer` following the approved architecture and design documents.

Before writing code, read and treat as authoritative:

`/Users/filippo/Projects/comity/packages/customer/docs/API.md` `/Users/filippo/Projects/comity/packages/customer/docs/DESIGN.md` `/Users/filippo/Projects/comity/packages/customer/docs/ARCHITECTURE-REVIEW.md` `/Users/filippo/Projects/comity/packages/customer/docs/PACKAGE-DESIGN.md` `/Users/filippo/Projects/comity/packages/customer/docs/IMPLEMENTATION-PLAN.md` `/Users/filippo/Projects/comity/packages/customer/README.md` `/Users/filippo/Projects/comity/packages/customer/SKILL.md` `/Users/filippo/Projects/comity/AGENTS.md`

These documents define the approved boundaries.

## Role

Act as a senior TypeScript architect implementing an approved Core Module.

Your goal is not to redesign the module.

Your goal is to translate the approved design into code while preserving all deferred decisions.

# Mandatory Rules

## Do not invent architecture

Do not introduce:

- new public APIs
- new exported types
- new dependencies
- new Core Module dependencies
- new abstractions not present in the design

If information is missing:
STOP and ask.

Do not resolve missing domain decisions yourself.

# Package Constraints

`@comity/customer` is a Core Module.

Allowed dependencies:

- @comity/primitives

Allowed only if explicitly required:

- @comity/kernel

Forbidden:

- adapters
- applications
- other Core Modules
- frameworks
- ORM libraries
- SQL libraries
- HTTP libraries

# Public API

Implement exactly the exports defined in API.md.

Public exports are only:

Domain:

- Customer
- CustomerId
- Profile
- Contact
- Address
- Preferences

Repository:

- CustomerRepository

Use Cases:

- CreateCustomer
- UpdateCustomer
- DeleteCustomer
- GetCustomer
- SearchCustomers

Errors:

- CustomerNotFound
- DuplicateCustomer
- InvalidCustomer
- InvalidAddress

Do not export:

- validation internals
- helpers
- factories
- adapters
- internal types

# Implementation Order

Follow this order.

## 1. Package Setup

Verify:

- package.json dependencies
- tsconfig inheritance
- source structure

Do not add dependencies without approval.

## 2. Domain Layer

Implement:

- CustomerId
- Customer aggregate
- Profile
- Contact
- Address
- Preferences

Follow API.md definitions.

Important:

- Customer lifecycle is a domain concept.
- Lifecycle states and transitions are intentionally NOT implemented.
- Do not create lifecycle abstractions.

## 3. Domain Errors

Implement customer-specific errors.

They must follow Comity error conventions.

Required:

- CustomerNotFound
- DuplicateCustomer
- InvalidCustomer
- InvalidAddress

Do not create additional error hierarchies.

## 4. Repository Contract

Implement CustomerRepository.

Important:

Do not decide:

- save vs create/update
- hard delete vs soft delete vs archive
- search criteria model
- not-found representation

Keep repository contract aligned with API.md.

Repository contracts must use domain models.

No infrastructure types.

## 5. Validation

Implement internal validation only.

Rules:

- Validation belongs to the module.
- Validation is not public API.
- Do not export validation utilities.
- Do not introduce Zod as a public dependency.

If using a validation library internally, confirm before adding it as dependency.

## 6. Use Cases

Implement:

- CreateCustomer
- UpdateCustomer
- DeleteCustomer
- GetCustomer
- SearchCustomers

Rules:

Use cases:

- depend on CustomerRepository abstraction
- validate before persistence operations
- return domain results/errors
- never call external systems
- never call other Core Modules

Do not implement:

- email sending
- CRM synchronization
- authentication linkage
- marketing workflows
- application orchestration

## 7. Tests

Add tests for:

Domain:

- value object invariants
- aggregate invariants
- domain errors

Repository contract:

- no infrastructure leakage
- correct domain boundaries

Use cases:

- validation before repository calls
- repository interaction through abstraction only

Tests must verify decisions from API.md.

Do not create tests for undefined behavior.

# Decision Freeze

The following remain intentionally unresolved:

- lifecycle states
- delete semantics
- auth/customer relationship
- validation public API
- repository method naming
- repository persistence semantics
- search criteria model

Do not implement assumptions for these.

# Before Finalizing

Provide:

1. Files created/modified
2. Public API exported
3. Dependencies added
4. Decisions made during implementation
5. Any blockers discovered

If implementation requires resolving an open decision:
stop and ask before coding.
