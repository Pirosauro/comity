# Package Design Review

## Scope

This review evaluates [PACKAGE-DESIGN.md](./PACKAGE-DESIGN.md) exclusively against:

- [AGENTS.md](../../../AGENTS.md)
- [README.md](../README.md)
- [SKILL.md](../SKILL.md)
- [DESIGN.md](./DESIGN.md)
- [API.md](./API.md)
- [ARCHITECTURE-REVIEW.md](./ARCHITECTURE-REVIEW.md)

The goal is to identify contradictions, boundary violations, premature implementation commitments, and missing decisions that would block implementation.

---

## Findings

### 1. `validation/` folder description could accidentally leak a public contract commitment

- Category: Boundary risk
- Severity: Warning
- Affected section: Responsibility of Each Folder → `validation/`
- Reference: [API.md](./API.md) (Validation Responsibilities), [DESIGN.md](./DESIGN.md) (Validation Strategy), [ARCHITECTURE-REVIEW.md](./ARCHITECTURE-REVIEW.md) (Finding 3)
- Why it matters: The `validation/` folder description says "validation rules and invariants"which is fine as an internal description. However, combined with the folder listing in Internal Architecture, there is a risk that validation gets treated as a stable public boundary by accident if later re-exported. This doesn't violate any document, but aligns with ARCHITECTURE-REVIEW.md's explicit recommendation to keep validation an open decision.
- Recommendation: No change required to the package-design. During implementation, guard against accidentally re-exporting `validation/` types from `index.ts` unless the validation API decision is resolved.

### 2. Testing descriptions partially restate domain invariants without explicit reference to API.md

- Category: Premature abstraction
- Severity: Warning
- Affected section: Testing Organization
- Reference: [API.md](./API.md) (Invariants), [DESIGN.md](./DESIGN.md) (Domain Concepts)
- Why it matters: The test descriptions mention `Contact` uniqueness per customer as a test target. This is correctly derived from API.md invariants, but the test section restates it as test description rather than referencing with "validate invariants defined in API.md." This introduces a slight risk of diverging test descriptions from the actual approved invariant list over time.
- Recommendation: Rephrase test descriptions to say "test invariants as defined in API.md" rather than enumerating them again. This avoids maintenance divergence.

### 3. No finding: the public exports are identically aligned with API.md

- Category: Verified
- Severity: None
- Affected section: Export Strategy
- Why it matters: A check between PACKAGE-DESIGN.md Export Strategy and API.md Public Exports found zero mismatches. Every exported concept (Customer, CustomerId, Profile, Contact, Address, Preferences), contract (CustomerRepository), use cases (CreateCustomer, UpdateCustomer, DeleteAdapter, GetCustomer, SearchCustomer) and error (CustomerNotFound, DuplicateCustomer, InvalidCustomer, InvalidAddress) is identically listed.

### 4. No finding: repository contract design does not resolve unresolved API questions

- Category: Verified
- Severity: None
- Affected section: Repository Organization
- Reference: [API.md](./API.md) (Repository Contracts)
- Why it matters: PACKAGE-DESIGN.md correctly describes persistence semantics only at the capability level ("a way to retrieve a customer," "a way to persist a customer," etc.) and keeps method names, create/update semantics, delete semantics, and not-found representation deferred. This explicitly respects all unresolved API questions.

### 5. No finding: use case relationship with repository is documented at capability level only

- Category: Verified
- Severity: None
- Affected section: Use Case Organization → Relationship with Repository
- Why it matters: PACKAGE-DESIGN.md states "Use cases depend on CustomerRepository" and "whether a use case calls a unified persistence capability or separate create/update operations is deferred." This does not encode method names, signatures, or create/update semantics in the package structure, exactly as required.

### 6. Lifecycle is present in the aggregate description but missing from the `domain/` folder responsibility explicitly

- Category: Documentation consistency
- Severity: Low
- Affected section: Domain Organization → Customer Aggregate
- Reference: [API.md](./API.md) (Public Concepts, Public Models Customer), [DESIGN.md](./DESIGN.md) (Domain Concepts → Customer Lifecycle)
- Why it matters: The `Customer Aggregate` section lists the grouped components (CustomerId, Profile, contacts, addresses, preferences) and mentions "lifecycle concept (states and transitions deferred)" in the aggregate description, but it doesn't appear as an entry in the folder responsibility section (which enumerates entity models and errors). This is not a contradiction, but adding "lifecycle concept (states deferred)" to the responsibility explicit would improve auditability.
- Recommendation: Add "lifecycle concept with deferred states" explicitly to the `domain/` folder responsibility section for completeness, already present in the section body.

---

## Final Assessment

### Overall Consistency Status

PACKAGE-DESIGN.md is consistent with all six source documents. No contradictions were found. Dependencies and boundaries are correctly respected. Public export alignment with API.md is perfectly exact.

### Blocking Issues Before Implementation

None. The PACKAGE-DESIGN.md is safe to proceed with implementation.

### Non-Blocking Improvements

Two optional documentation polish points (findings #1 and #3) but neither is blocking.

### Readiness as Implementation Guide

**PACKAGE-DESIGN.md is ready to serve as the implementation guide for @comity/customer.**

It describes folder responsibilities at sufficient granularity while keeping open design decisions deferred. The proposed structure respects Core Module layering, does not accidentally contractify architectural decisions, and maintains consistency with the existing public API.
