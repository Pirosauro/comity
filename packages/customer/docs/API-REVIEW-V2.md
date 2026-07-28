# API Review v2

## Scope

This review evaluates [API.md](./API.md) exclusively against:

- [AGENTS.md](../../../AGENTS.md)
- [README.md](../README.md)
- [SKILL.md](../SKILL.md)
- [DESIGN.md](./DESIGN.md)
- [ARCHITECTURE-REVIEW.md](./ARCHITECTURE-REVIEW.md)

This review follows the constraints of ARCHITECTURE-REVIEW.md but applies them exclusively to the updated API proposal.

---

## Findings

### 1. `Customer Lifecycle` appears in Public Concepts but is omitted from Public Models

- Category: Contradiction
- Severity: Important
- Affected section: Public Models → `Customer`
- Rationale: [API.md](./API.md) (Public Concepts) declares `Customer Lifecycle` as a public concept with deferred states. The Public Models section properly acknowledges lifecycle as a domain concept in the `Customer` model description, but does not include `Customer Lifecycle` as its own model entry alongside `Profile`, `Contact`, `Address`, `Preferences`. [DESIGN.md](./DESIGN.md) (Domain Concepts) lists `Customer Lifecycle` alongside the other four concepts as a structural member of the domain.
- Recommendation: Add a brief `Customer Lifecycle` entry under Public Models stating that lifecycle belongs to the customer domain, that the specific lifecycle model is deferred, and does not yet have a public representation.

### 2. `Contact Information` is acknowledged as a domain concept but absent from Public Concepts

- Category: Public API inconsistency
- Severity: Important
- Affected section: Public Concepts
- Rationale: [DESIGN.md](./DESIGN.md) (Domain Concepts) lists `Contact Information` as one of the six identified domain concepts. [API.md](./API.md) lists `Contact` but not `Contact Information`. The `Contact` section explains the relationship between the mut names but `Contact Information` is not a public concept. This means the public API vocabulary omits a documented domain concept.
- Recommendation: Add `Contact Information` to the Public Concepts list with a note that it is modelled as a collection of `Contact` represented at the API level by arrays of `Contact`.

### 3. `Addresses` plural concept omitted from Public Concepts

- Category: Omission
- Severity: Warning
- Affected section: Public Concepts
- Rationale: [DESIGN.md](./DESIGN.md) lists `Addresses` (plural) as a domain concept. [API.md](./API.md) only declares `Address` (singular) as a public concept. The `Address` model entry correctly references `Addresses` but the public vocabulary surface omits the plural form that exists in DESIGN.md.
- Recommendation: Add `Addresses` to the Public Concepts list as the plural domain concept.

### 4. Use case boundary missing `call other Core Modules` which ARCHITECTURE-REVIEW.md flagged as critical

- Category: Missing API decision
- Severity: Critical
- Affected section: Use Cases
- Rationale: [ARCHITECTURE-REVIEW.md](./ARCHITECTURE-REVIEW.md) (Finding 8 - boundary violation risk / missing decision) explicitly flags that the auth/customer linkage remains unresolved at the API contract level and recommends adding an explicit unresolved question about auth-to-customer linking. [API.md](./API.md)’s aggregate boundary forbids cross-module relationships, but the unresolved questions omit this critical outstanding decision.
- Recommendation: Add an explicit unresolved question: "How will auth-to-customer linkage be modeled without breaking aggregate boundaries or requiring cross-module references in Core Modules?"

### 5. spacing in repository section nie-consistenta: uses both `Retrieve a customer` and `Persist a customer` patterns

- Category: Naming inconsistency (document-level)
- Severity: Warning
- Affected section: Repository Contracts
- Rationale: [API.md](./API.md) uses the same pattern (`Retrieve`, `Persist`, `Remove`, `Search`) which is consistent internal to the document. However, the semantic naming moves from verbs to action-oriented nouns. This is not an external inconsistency, but a slight inconsistency potential to drift toward implementation-specific naming.
- Recommendation: Keep the current capability-oriented naming. If further review raises this as an issue, consider aligning to "Retrieve a customer", "Persist a customer", "Remove a customer from domain", "Search customers" consistently.

### 6. The "Persist a customer" capability requires unresolved decision on create versus update semantics

- Category: Missing API decision
- Severity: Important
- Affected section: Repository Contracts → Persist a customer
- Rationale: [ARCHITECTURE-REVIEW.md](./ARCHITECTURE-REVIEW.md) (finding 9) explicitly states that delete semantics, duplicate criteria, and search capability decisions shape public contract. The current API correctly defers the save signature and distinction between create and update, but the unresolved question only mentions distinguish between `save(insert vs update)` vs `create/update`. The unresolved decision question lags behind the design requirement.
- Recommendation: Keep the deferred save semantics in the Repository section, and add a separate unresolved API question about whether the repository exposes a single `save` or separate `create`/`update`.

### 7. `not found` representation is unresolved but several repository capabilities still prescribe null-ish semantics

- **Category**: Leaked implementation detail
- **Severity**: Warning
- **Affected section**: Repository Contracts → Retrieve
- **Rationale**: [API.md](./API.md) Repository Contracts correctly removes the `get(CustomerId) → Result<Customer | null>` signature, but still leaves a residual pattern where the `Remove` capability implies "reports whether the operation succeeded or the customer was not found." This implicitly commits the notion of "not found" as a binary result rather than a domain error.
- **Recommendation**: Strike the phrase "or the customer was not found" from the `Remove a customer from domain` section and keep only "the error model reports whether the operation succeeded."

### 8. Validation responsibilities no longer conflict with DESIGN.md, but still document a contradiction with README.md

- **Category**: Contradiction (residual)
- **Severity**: Warning
- **Affected section**: Validation Responsibilities
- **Rationale**: [README.md](../README.md) (Public API section) states "Validation contracts (if exposed)" as part of the public API. [API.md](./API.md) states "Whether validation contracts become part of the public API remains an open design decision." This is now open-out from validation, but README.md’s public API placeholder `"Validation contracts (if exposed)"` is still live. The API document treats it as open, which is better than previously, but still out-of-sync with README’s definitive statement.
- **Recommendation**: Recommend README update once API is finalized, else enumerate validation as a pending public API placeholder consistent with "open design decision."

### 9. `search` questions about CustomerSearchCriteria don't match repository contract`s explicitly-deferred `Criteria

- **Category**: Missing information / Inconsistency
- **Severity**: Warning
- **Affected section**: Unresolved API Questions, Repository Contracts → Search
- **Rationale**: [API.md](./API.md) Unresolved API Questions asks "Should the module expose a `CustomerSearchCriteria` type alongside `SearchCustomers`". The Repository Contracts Search section says the `Criteria` model is intentionally unspecified. These are two different aspects: the public API surface for the search criteria agrees with an open question, but the question refers to `CustomerSearchCriteria` while the contract refers to `Criteria`. The inconsistency is minor but creates drift.
- **Recommendation**: Align the unresolved question wording with the repository contract`Criteria placeholder to remove naming drift.

### 10. Unnecessary duplication of the word "by" in repository description

- **File**: trivial issue in current file
- **Severity**: Minimal
- **Location**: Repository Contracts → Retrieve a customer (`by their by` duplicate in line 171)
- **Recommendation**: Remove trivial typographic error.

---

## Overall Assessment

The API proposal is now consistent with DESIGN.md and SKILL.md in most aspects. Lifecycle and validation are correctly treated as open or deferred. Repository contract leakage has been significantly reduced.

Remaining risks:

- The auth-customer boundary question (finding #4) is critical and must be resolved or marked as an explicit unresolved decision before the API is approved.
- The README.md public API placeholder "Validation contracts (if exposed)" still creates a documentation mismatch (README is source, but API uses it to declare open design). This is not an API defect, but a documentation sync gap that should be tracked.

Eight of eleven findings are warnings or documentation polish; only #4 and #8 are API structural issues requiring explicit attention.
