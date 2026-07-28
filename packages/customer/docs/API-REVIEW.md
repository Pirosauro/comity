# API Review

## Scope

This review evaluates [API.md](./API.md) exclusively against the documented architecture and domain decisions.

# Findings

### 1. Lifecycle is documented as module responsibility but excluded from the API

- Category: Contradiction
- Severity: Important
- Affected section: Public Concepts, Public Models → `Customer`
- Rationale: API.md explicitly states a Customer does not contain "lifecycle state information (explicitly deferred to a later design iteration)." This contradicts [SKILL.md](../SKILL.md) (Responsibilities) and [DESIGN.md](./DESIGN.md) (Domain Concepts), both of which include lifecycle as a module-owned responsibility and domain concept. Deferring lifecycle states is legitimate; excluding lifecycle entirely from the domain model is a scope reduction without documented approval.
- Recommendation: Replace the exclusion with an explicit statement that lifecycle belongs to the customer domain but lifecycle states are deferred. The model should acknowledge lifecycle as a concept, not remove it.

### 2. API omits `Customer Lifecycle` while listing every other Domain Concept

- Category: Missing API decision
- Severity: Important
- Affected section: Public Concepts
- Rationale: [DESIGN.md](./DESIGN.md) (Domain Concepts) lists `Customer Lifecycle` alongside `Customer`, `Profile`, `Contact Information`, `Addresses`, and `Preferences`. The API lists all of these as public concepts except `Customer Lifecycle`. The omission is not explained as a deferred concept; it is simply absent. This creates an inconsistency between the approved domain vocabulary and the API surface.
- Recommendation: Either add `Customer Lifecycle` to public concepts (with deferred states) or document explicitly why it is excluded, referencing a design decision that overrides current documentation.

### 3. Validation section contradicts DESIGN.md on public API openness

- Category: Contradiction
- Severity: Important
- Affected section: Validation Responsibilities
- Rationale: API.md states "It does not export a validation library, a public `validate` function, or a redundant validation contract." However, [DESIGN.md](./DESIGN.md) (Validation Strategy) states "The public validation API, if any, remains an open design decision." The API closes this open question without citing a decision. It also contradicts [README.md](../README.md) (Public API) which lists "Validation contracts (if exposed)" as a deliberate public API placeholder.
- Recommendation: Replace the definitive statement with "Validation is owned by the module. Whether validation contracts become part of the public API remains an open design decision."

### 4. API prescribes `get` returns `null`, conflicting with its own unresolved question

- Category: Leaked implementation detail
- Severity: Optional
- Affected section: Repository Contracts → `get(CustomerId)`
- Rationale: API prescribes that `get` returns `null` when a customer is not found. This is an implementation-level representation choice. The alternative is `CustomerNotFound` domain error. This is listed as unresolved in the same document, so committing to `null` contradicts the API's own open posture.
- Recommendation: Leave not-found representation open and reference it in Unresolved API Questions.

### 5. API lists `save` as required contract method while declaring signature unresolved

- Category: Leaked implementation detail
- Severity: Important
- Affected section: Repository Contracts → `save(Customer)`
- Rationale: API.md includes `save` among the "methods required in the contract." Simultaneously, it states the exact signature is "intentionally unspecified because it requires deciding representation of partial update." Listing `save` as a required method while declaring it unresolved freezes the method name and semantics without documented approval.
- Recommendation: Describe `save` as a proposed pattern rather than a required method. Keep the repository contract flexible: there must be a way to persist a customer, but the exact method name and signature are pending.

### 6. `Contact` naming contradicts DESIGN.md vocabulary

- Category: Naming inconsistency
- Severity: Important
- Affected section: Public Concepts, Public Models → `Contact`
- Rationale: DESIGN.md uses `Contact Information` (plural, abstract). API.md introduces `Contact` (singular, model). SKILL.md uses `Contacts` in the domain model hierarchy. The shift from domain-concept to model type is not documented as a decision.
- Recommendation: Keep `Contact` as the model type and document its relationship to the domain concept `Contact Information` explicitly.

### 7. `Address` declared as value object, `Addresses` plural concept unaddressed

- Category: Aggregate inconsistency
- Severity: Important
- Affected section: Value Objects
- Rationale: API.md declares `Address` as a value object. [SKILL.md](../SKILL.md) (Domain Model) lists `Addresses` in the aggregate hierarchy, and [DESIGN.md](./DESIGN.md) lists `Addresses` as a domain concept. The singular/plural mapping is correct but not documented.
- Recommendation: Keep `Address` as the value object type, add note that `Addresses` (the domain concept) represents zero-or-more addresses belonging to the aggregate.

### 8. Aggregate boundary forbids cross-module references, auth integration unresolved

- Category: Boundary violation risk / Missing decision
- Severity: Important
- Affected section: Aggregate Boundaries
- Rationale: API.md forbids "fields that represent cross-module relationships" consistent with DESIGN.md. However, [README.md](../README.md) (Extension points) states the module integrates with `@comity/auth`. How linkage occurs without cross-module references is unresolved at the API contract level.
- Recommendation: Add an explicit unresolved question about auth-to-customer linking model without breaking aggregate boundaries or Core Module independence.

### 9. Public exports omit `Contact Information` and `Customer Lifecycle`

- Category: Public API inconsistency
- Severity: Important
- Affected section: Public Exports
- Rationale: Exports list `Customer`, `CustomerId`, `Profile`, `Contact`, `Address`, `Preferences`. Missing: `Contact Information` and `Customer Lifecycle`, both appearing in DESIGN.md and SKILL.md as domain concepts. Gaps in export surface, not deliberate exclusions.
- Recommendation: Either expose both or document why they are not part of the public API.

### 10. `search` contract prescribes `Criteria` model but leaves `CustomerSearchCriteria` unresolved

- Category: Missing API decision
- Severity: Optional
- Affected section: Repository Contracts → `search`
- Rationale: API.md uses `Criteria` as the search input while Unresolved API Questions asks whether to expose `CustomerSearchCriteria`. No commitment linking these two.
- Recommendation: Keep `search` with `Criteria` placeholder and ensure resolution affects repository contract semantics, not just naming.

---

## Overall Assessment

- The design is directionally consistent with the project architecture and is appropriately cautious about unresolved domain knowledge.
- The main remaining risks are not implementation risks; they are boundary and policy risks.
- The most important unresolved areas are lifecycle ownership, validation contract scope, identity boundary, use case scope, and the exact dependency policy for Core Modules.
- Optional issues mostly concern vocabulary and abstraction timing rather than architectural correctness.
