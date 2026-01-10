---
id: quality-domains
status: authoritative
version: 1.0.1
owner: @architecture-council
enforcement: block
last_reviewed: 2026-01-10
next_review: 2027-01-10
supersedes: []
---

# Quality Domains Standard

## Purpose

This standard operationalizes the **"Quality Domain Declaration" constitutional axiom** (Axiom 10). It defines the mandatory classification system for Comity modules and specifies the governance expectations for each domain.

This is a **Level 3: Authoritative Standard**. Violations block merges.

---

## Scope

This Standard applies to **all Comity modules** (packages, libraries, services) within the Comity ecosystem.

**Out of scope:** One-off scripts, build configuration files, and documentation-only projects.

---

## 1. Declaration Requirement

### 1.1 Mandatory Declaration

**Rule 1.1.1:** Every Comity module MUST declare a Quality Domain.

**Enforcement:** CI/CD validation. Missing declaration blocks merge.

### 1.2 Declaration Format

**Rule 1.2.1:** The declaration MUST be defined in `package.json` under `comity.qualityDomain`.

**Example:**

```json
{
  "name": "@comity/auth",
  "comity": {
    "qualityDomain": "core",
    "owner": "@security-team"
  }
}
```

**Enforcement:** JSON schema validation. Invalid format blocks merge.

### 1.3 Valid Values

**Rule 1.3.1:** The `qualityDomain` property MUST be one of:

- `core`
- `strategic`
- `experimental`

**Enforcement:** Enum validation. Invalid value blocks merge.

---

## 2. Domain Definitions

### 2.1 Core Domain

#### Definition

**Rule 2.1.1:** Modules whose failure would compromise system-wide correctness, security, or trust MUST use the `core` domain.

**Indicators for Core domain:**

- Defines global invariants or contracts
- Implements security-critical functionality
- Contains business logic with system-wide impact
- Provides foundational infrastructure used by multiple teams

**Examples:**

- Authentication and authorization systems
- Error handling infrastructure
- Core business logic and domain models
- Security primitives and cryptographic operations
- Lifecycle and dependency management

#### Requirements

**Rule 2.1.2:** Core modules MUST have full compliance with all applicable Comity Standards.

**Rule 2.1.3:** Changes to Core modules MUST be reviewed by the Architecture Council.

**Rule 2.1.4:** Semantic or behavioral changes to Core modules MUST be documented in an ADR.

**Rule 2.1.5:** Core modules MUST meet the high test coverage thresholds defined in CI Quality Profiles.

#### Quality Philosophy

> For Core modules, a feature that works but violates invariants is considered broken.

**Interpretation:** Correctness and safety take absolute precedence over convenience or velocity.

### 2.2 Strategic Domain

#### Definition

**Rule 2.2.1:** Modules with limited but significant impact on system behavior MAY use the `strategic` domain.

**Indicators for Strategic domain:**

- Used by multiple consumers but replaceable
- Defines important but not foundational contracts
- Performance-critical but with contained failure modes
- Important for system operation but not for system correctness

**Examples:**

- Database adapters and persistence layers
- External API clients and integration points
- Shared utilities without global invariants
- Performance-critical but replaceable components
- Observability and telemetry infrastructure

#### Requirements

**Rule 2.2.2:** Strategic modules MUST comply with all relevant Comity Standards.

**Rule 2.2.3:** Changes to Strategic modules MUST be reviewed by maintainers or technical leads.

**Rule 2.2.4:** Behavioral changes to Strategic modules SHOULD be documented in an ADR.

**Rule 2.2.5:** Strategic modules MUST meet the medium-to-high test coverage thresholds defined in CI Quality Profiles.

#### Quality Philosophy

> For Strategic modules, stability of external behavior takes precedence over internal perfection.

**Interpretation:** Reliability and maintainability are prioritized, but some technical debt may be acceptable if contained.

### 2.3 Experimental Domain

#### Definition

**Rule 2.3.1:** Modules with limited scope, low blast radius, and explicit replaceability MAY use the `experimental` domain.

**Indicators for Experimental domain:**

- Limited to specific team or use case
- Explicitly marked as temporary or exploratory
- Easy to replace or remove without system impact
- Learning or prototyping purpose documented

**Examples:**

- Proofs of concept and research prototypes
- Third-party integrations with limited usage
- Temporary features with sunset dates
- Team- or project-specific tooling
- Exploratory implementations of new patterns

#### Requirements

**Rule 2.3.2:** Experimental modules SHOULD make best-effort compliance with Comity Standards.

**Rule 2.3.3:** Review of Experimental modules is optional and context-dependent.

**Rule 2.3.4:** Experimental modules have no ADR requirement.

**Rule 2.3.5:** Experimental modules MUST meet the baseline test coverage thresholds defined in CI Quality Profiles.

#### Quality Philosophy

> For Experimental modules, learning and speed are prioritized over optimization.

**Interpretation:** Rapid iteration and learning are valued, with the understanding that code may be discarded or significantly refactored.

---

## 3. Transition Rules

### 3.1 Explicit Transitions

**Rule 3.1.1:** Changing a module's Quality Domain MUST be explicit and documented.

**Required documentation:**

- Reason for transition
- Impact assessment
- Updated `package.json` declaration
- Communication to affected teams

### 3.2 Upgrading Domain (Lower to Higher)

**Rule 3.2.1:** Transitioning from a lower to a higher Quality Domain (e.g., `experimental` → `strategic` → `core`) requires justification and an ADR.

**Justification requirements:**

- Demonstrated stability and adoption
- Impact analysis showing need for stronger governance
- Team capacity to meet higher domain requirements
- Migration plan for any existing technical debt

### 3.3 Downgrading Domain (Higher to Lower)

**Rule 3.3.1:** Transitioning from a higher to a lower Quality Domain (e.g., `core` → `strategic` → `experimental`) requires explicit risk acceptance.

**Risk acceptance requirements:**

- Documented analysis of reduced governance impact
- Sunset plan for critical functionality if applicable
- Stakeholder approval
- Clear ownership of the risk decision

---

## 4. Enforcement

### 4.1 Declaration Enforcement

**Rule 4.1.1:** Missing `qualityDomain` declarations MUST block merges.

**Enforcement method:** CI/CD validation of `package.json` structure.

### 4.2 Value Validation

**Rule 4.2.1:** Invalid `qualityDomain` values MUST block merges.

**Enforcement method:** Enum validation against allowed values.

### 4.3 Domain-Specific Enforcement

**Rule 4.3.1:** Domain-specific validation failures MUST block merges according to the active CI Quality Profile for the declared domain.

**Implementation:** CI/CD pipeline loads the appropriate Quality Profile based on declared domain and applies corresponding validation rules.

---

## 5. Integration with Other Standards

### 5.1 Error Handling Standard Integration

**For Core modules:** Full compliance with Error Handling Standard required.
**For Strategic modules:** Compliance with error patterns required, some flexibility allowed.
**For Experimental modules:** Best-effort error handling expected.

### 5.2 Core Purity Standard Integration

**For Core modules:** Strict Core purity enforcement.
**For Strategic modules:** Core purity encouraged but not strictly enforced in all cases.
**For Experimental modules:** Core purity optional.

### 5.3 Type Safety Standard Integration

**For Core modules:** Full type safety requirements.
**For Strategic modules:** Type safety with some pragmatic exceptions.
**For Experimental modules:** Basic type safety expected.

### 5.4 Code Review Verification Integration

**For Core modules:** Architecture Council review required.
**For Strategic modules:** Maintainer review sufficient.
**For Experimental modules:** Review optional.

---

## 6. Compliance Verification

### 6.1 Automated Verification

The CI/CD pipeline MUST validate:

1. **Declaration presence:** `comity.qualityDomain` exists in `package.json`
2. **Value validity:** Value is one of `core`, `strategic`, `experimental`
3. **Domain-specific rules:** Applies appropriate validation profile

### 6.2 Manual Verification

Reviewers MUST verify:

**For Core modules:**

- [ ] ADR exists for architectural changes
- [ ] Architecture Council review completed
- [ ] High test coverage achieved
- [ ] All Standards compliance verified

**For Strategic modules:**

- [ ] Maintainer review completed
- [ ] Test coverage meets strategic thresholds
- [ ] Relevant Standards compliance verified

**For Experimental modules:**

- [ ] Experimental nature documented
- [ ] Baseline test coverage achieved
- [ ] No critical security or stability issues

### 6.3 Quality Profiles Implementation

Numeric thresholds and specific validation rules are defined in separate CI Quality Profiles (`/.github/comity/quality-profiles.yml`). This Standard defines what must be validated; Quality Profiles define how and to what degree.

---

## 7. Migration for Existing Modules

### 7.1 Grace Period

Existing modules without Quality Domain declarations have a **90-day grace period** to add declarations.

### 7.2 Default Classification

During grace period, modules without declaration are treated as:

- If previously subject to Architecture Council review: `core`
- If used by multiple teams: `strategic`
- Otherwise: `experimental`

### 7.3 Assistance

Teams may request Architecture Council assistance in classifying existing modules.

---

## 8. References

- [Constitutional Axioms §10](/docs/00-constitution/constitutional-axioms.md#axiom-10-quality-domain-declaration) - Foundational requirement
- [CI Quality Profiles](/.github/comity/quality-profiles.yml) - Enforcement implementation
- [Error Handling Standard](/docs/03-standards/error-handling.md) - Error pattern requirements
- [Core Purity Standard](/docs/03-standards/core-purity.md) - Architectural constraints
- [Type Safety Standard](/docs/03-standards/type-safety.md) - Type usage requirements
- [Code Review Verification Standard](/docs/03-standards/code-review-verification-standard.md) - Review requirements
- [Documentation Governance](/docs/00-constitution/documentation-governance.md) - Compliance procedures

---

## 9. Compliance Statement

This Standard complies with Constitutional Axioms:

- **Axiom 2:** Level 3 Standard, under Constitutional Axioms
- **Axiom 3:** Single authoritative source for Quality Domain rules
- **Axiom 8:** Every rule specifies enforcement method
- **Axiom 10:** Implements the Quality Domain Declaration requirement

This Standard does NOT duplicate rules from other Standards. It references them for domain-specific application.

---

## 10. Amendment History

_2026-01-10_: Initial version - Quality Domains Standard implementing Axiom 10

---

**Note:** This Standard defines **what** Quality Domains are and **what** they require. The **how** of enforcement is defined in CI Quality Profiles. Teams must consult both documents for complete implementation guidance.
